import browser from 'webextension-polyfill'
import { useEffect, useState } from 'react'
import { useSharedStore, useStore } from '@src/store'
import { HDMasterSeed } from '@radixdlt/crypto'
import { MessageService, PORT_NAME } from '@src/services/messanger'
import { GET } from '@src/lib/actions'
import { KeystoreType } from '@src/store/types'

let port = browser.runtime.connect({ name: PORT_NAME })
const messanger = new MessageService('extension', port, null)

port.onDisconnect.addListener(() => {
	if (port.error) {
		// eslint-disable-next-line no-console
		console.error(`Disconnected due to an error: ${port.error.message}`)
	}
	port = browser.runtime.connect({ name: PORT_NAME })
	messanger.initPort(port)
})

const refreshInterval = 60 * 1000 // 1 minute

export const useVault = () => {
	const { keystore, seed, setMessanger, setSeed, unlockHW } = useSharedStore(state => ({
		seed: state.masterSeed,
		keystore: state.keystores.find(({ id }) => id === state.selectKeystoreId),
		setMessanger: state.setMessangerAction,
		setSeed: state.setMasterSeedAction,
		unlockHW: state.unlockHardwareWalletAction,
	}))
	const { networkIndex, accountIndex, selectAccount } = useStore(state => ({
		networkIndex: state.selectedNetworkIndex,
		accountIndex: state.selectedAccountIndex,
		selectAccount: state.selectAccountAction,
	}))

	const [time, setTime] = useState<number>(Date.now())

	useEffect(() => {
		const interval = setInterval(() => setTime(Date.now()), refreshInterval)

		return () => {
			clearInterval(interval)
		}
	}, [])

	const init = async () => {
		try {
			if (keystore && keystore.type === KeystoreType.HARDWARE) {
				unlockHW()
			} else {
				const { seed: newSeed } = await messanger.sendActionMessageFromPopup(GET, null)
				if (newSeed) {
					setSeed(HDMasterSeed.fromSeed(Buffer.from(newSeed, 'hex')))
				}
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
			window.location.reload()
		}
		setMessanger(messanger)
	}

	useEffect(() => {
		init()
	}, [keystore])

	useEffect(() => {
		if (seed) {
			selectAccount(accountIndex, null, seed)
		}
	}, [seed])

	useEffect(() => {
		const load = async () => {
			try {
				await messanger.sendActionMessageFromPopup(GET, null) // extend session
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error)
				window.location.reload()
			}
		}

		load()
	}, [networkIndex, accountIndex, time])
}
