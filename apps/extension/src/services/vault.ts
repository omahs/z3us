/* eslint-disable no-case-declarations */
import browser from 'webextension-polyfill'
import { Mnemonic, SigningKey, SigningKeyT } from '@radixdlt/application'
import {
	HDMasterSeed,
	HDNode,
	HDNodeT,
	HDPathRadix,
	MnemomicT,
	KeystoreT,
	Keystore as RadixKeystore,
	PublicKey,
} from '@radixdlt/crypto'
import { BrowserStorageService } from '@src/services/browser-storage'
import { sharedStoreKey } from '@src/config'
import { SharedState } from '@src/store/types'
import { sharedStore } from '@src/store'
import { firstValueFrom } from 'rxjs'
import { CryptoService } from './crypto'

type KeystoreType = 'mnemonic' | 'key' | 'legacy'

interface Keystore {
	type: KeystoreType
	secret: string
}

export const keystoreKey = 'z3us-keystore'

const getKeystorePrefix = async () => {
	const data = await browser.storage.local.get(sharedStoreKey)
	const { lastError } = browser.runtime
	if (lastError) {
		throw new Error(lastError.message)
	}
	if (!data[sharedStoreKey]) {
		return ''
	}
	const state = JSON.parse(data[sharedStoreKey])?.state as SharedState
	return state?.selectKeystoreId || ''
}

const getSigningKey = (hdMasterNode: HDNodeT, index: number): SigningKeyT => {
	const hdPath = HDPathRadix.create({ address: { index, isHardened: true } })
	return SigningKey.fromHDPathWithHDMasterNode({ hdPath, hdMasterNode })
}

export class VaultService {
	private crypto: CryptoService

	private storage: BrowserStorageService

	private hdMasterNode?: HDNodeT

	private signinKey?: SigningKeyT

	private timer?: NodeJS.Timeout

	constructor(storage: BrowserStorageService, crypto: Crypto) {
		this.storage = storage
		this.crypto = new CryptoService(crypto)
	}

	new = async (type: KeystoreType, secret: string, password: string, index: number = 0) => {
		const keystore = await this.crypto.encrypt<Keystore>(password, { type, secret })
		await this.saveKeystore(keystore)

		const { hdMasterNode } = await this.getHDMasterNode(keystore, password)
		this.hdMasterNode = hdMasterNode
		return this.derive(index)
	}

	unlock = async (password: string, index: number) => {
		const keystore = await this.getKeystore()
		const { hdMasterNode } = await this.getHDMasterNode(keystore, password)
		this.hdMasterNode = hdMasterNode
		return this.derive(index)
	}

	lock = () => {
		if (this.timer) {
			clearTimeout(this.timer)
		}
		this.hdMasterNode = null
		this.signinKey = null
		this.timer = null
	}

	derive = async (index: number) => {
		const keystoreId = await getKeystorePrefix()
		const hasKeystore = await this.has()

		if (!this.hdMasterNode) {
			this.signinKey = null
			this.hdMasterNode = null
			return {
				hasKeystore,
				keystoreId,
			}
		}

		await this.resetTimer()
		const signinKey = getSigningKey(this.hdMasterNode, index)

		this.signinKey = signinKey

		return {
			hasKeystore,
			keystoreId,
			publicKey: signinKey.publicKey.toString(),
		}
	}

	has = async (): Promise<boolean> => {
		try {
			const suffix = await getKeystorePrefix()
			const keystore = await this.storage.getItem(`${keystoreKey}-${suffix}`)
			return !!keystore
		} catch (err) {
			return false
		}
	}

	get = async (password: string) => {
		const keystore = await this.getKeystore()
		const { hdMasterNode, mnemonic } = await this.getHDMasterNode(keystore, password)

		return {
			mnemonic: mnemonic
				? {
						strength: mnemonic.strength,
						entropy: mnemonic.entropy.toString('hex'),
						words: mnemonic.words,
						phrase: mnemonic.phrase,
						language: mnemonic.language,
				  }
				: undefined,
			hdMasterNode: hdMasterNode.toJSON(),
		}
	}

	remove = async () => {
		const suffix = await getKeystorePrefix()
		this.lock()
		await this.storage.removeItem(`${keystoreKey}-${suffix}`)
	}

	encrypt = async (plaintext: string, publicKeyOfOtherParty: string) => {
		if (!this.signinKey) throw new Error('Unauthorised!')

		const publicKeyBuffer = Buffer.from(publicKeyOfOtherParty, 'hex')
		const publicKeyResult = PublicKey.fromBuffer(publicKeyBuffer)
		if (!publicKeyResult.isOk()) {
			throw publicKeyResult.error
		}

		const ecnrypted = await firstValueFrom(
			this.signinKey.encrypt({
				plaintext,
				publicKeyOfOtherParty: publicKeyResult.value,
			}),
		)
		return ecnrypted.combined().toString('hex')
	}

	decrypt = async (message: string, publicKeyOfOtherParty: string) => {
		if (!this.signinKey) throw new Error('Unauthorised!')

		const publicKeyBuffer = Buffer.from(publicKeyOfOtherParty, 'hex')
		const publicKeyResult = PublicKey.fromBuffer(publicKeyBuffer)
		if (!publicKeyResult.isOk()) {
			throw publicKeyResult.error
		}

		return firstValueFrom(
			this.signinKey.decrypt({
				encryptedMessage: Buffer.from(message, 'hex'),
				publicKeyOfOtherParty: publicKeyResult.value,
			}),
		)
	}

	sign = async (blob: string, hashOfBlobToSign: string, nonXrdHRP: string = undefined) => {
		if (!this.signinKey) throw new Error('Unauthorised!')

		const signature = await firstValueFrom(this.signinKey.sign({ blob, hashOfBlobToSign }, nonXrdHRP))
		return signature.toDER()
	}

	signHash = async (hash: string) => {
		if (!this.signinKey) throw new Error('Unauthorised!')

		const signature = await firstValueFrom(this.signinKey.signHash(Buffer.from(hash, 'hex')))
		return signature.toDER()
	}

	private saveKeystore = async (keystore: string) => {
		const suffix = await getKeystorePrefix()
		await this.storage.setItem(`${keystoreKey}-${suffix}`, keystore)
	}

	private getKeystore = async (): Promise<string> => {
		const suffix = await getKeystorePrefix()
		const data = await this.storage.getItem(`${keystoreKey}-${suffix}`)
		if (!data) {
			throw new Error('No keystore!')
		}
		return data
	}

	private resetTimer = async () => {
		const { walletUnlockTimeoutInMinutes = 5 } = sharedStore.getState()
		if (this.timer) {
			clearTimeout(this.timer)
		}

		this.timer = setTimeout(() => this.lock(), walletUnlockTimeoutInMinutes * 60 * 1000)
	}

	private getHDMasterNode = async (
		data: string,
		password: string,
	): Promise<{
		mnemonic?: MnemomicT
		hdMasterNode: HDNodeT
	}> => {
		let keystore = await this.crypto.decrypt<Keystore>(password, data)
		// migrate data if is legacy keystore
		if (keystore === false) {
			const kesytoreResult = await RadixKeystore.decrypt({ keystore: JSON.parse(data) as KeystoreT, password })
			if (kesytoreResult.isErr()) {
				throw kesytoreResult.error
			}
			keystore = { type: 'legacy', secret: kesytoreResult.value.toString('hex') }
		} else {
			keystore = keystore as Keystore
		}

		switch (keystore.type) {
			case 'legacy':
				const newKeystore = await this.crypto.encrypt<Keystore>(password, { type: 'mnemonic', secret: keystore.secret })
				await this.saveKeystore(newKeystore)
			// eslint-disable-next-line no-fallthrough
			case 'mnemonic':
				const mnemonic = Mnemonic.fromEntropy({ entropy: Buffer.from(keystore.secret, 'hex') })
				if (mnemonic.isErr()) {
					throw mnemonic.error
				}

				const masterSeed = HDMasterSeed.fromMnemonic({ mnemonic: mnemonic.value })

				return {
					mnemonic: mnemonic.value,
					hdMasterNode: masterSeed.masterNode(),
				}
			case 'key':
				const hdNodeResult = HDNode.fromExtendedPrivateKey(keystore.secret)
				if (hdNodeResult.isErr()) {
					throw hdNodeResult.error
				}
				return { hdMasterNode: hdNodeResult.value }
			default:
				throw new Error(`Invalid keystore type`)
		}
	}
}
