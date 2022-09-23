import browser from 'webextension-polyfill'
import { Mutex } from 'async-mutex'
import { accountStore, defaultAccountStore, sharedStore } from '@src/store'
import { RadixService } from '@src/services/radix'
import { getShortAddress, getTransactionType } from '@src/utils/string-utils'
import { Transaction } from '@src/types'

export async function getLastTransactions(
	useStore: typeof defaultAccountStore,
): Promise<{ [address: string]: Array<Transaction> }> {
	const state = useStore.getState()
	const { networks, selectedNetworkIndex, publicAddresses } = state
	const allAddresses = Object.values(publicAddresses).map(entry => entry.address)

	const network = networks[selectedNetworkIndex]

	const service = new RadixService(network.url)

	const transactionMap = {}
	await Promise.all(
		allAddresses.map(async address => {
			try {
				const { transactions } = await service.transactionHistory(address)
				transactionMap[address] = transactions
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error)
			}
		}),
	)
	return transactionMap
}

let lastTxIds = {}
let isCheckingTransactions = false
const watchTransactions = async (selectKeystoreId: string, useStore: typeof defaultAccountStore) => {
	if (isCheckingTransactions) return
	isCheckingTransactions = true
	try {
		const transactionMap = await getLastTransactions(useStore)
		const newLastTxIds = {}
		Object.keys(transactionMap).forEach(async address => {
			const transactions = transactionMap[address]
			if (transactions.length > 0) {
				newLastTxIds[address] = transactions[0].id
			}

			const lastTxId = lastTxIds[address]
			if (lastTxId) {
				for (let i = 0; i < transactions.length; i += 1) {
					const tx = transactions[i]
					if (lastTxId === tx.id) {
						break
					}
					const action = tx.actions.find(a => a.from_account === address || a.to_account === address)
					const activity = action ? getTransactionType(address, action) : 'Unknown'

					// eslint-disable-next-line no-await-in-loop
					await browser.notifications.create(`tx-${selectKeystoreId}-${tx.id}`, {
						type: 'basic',
						iconUrl: browser.runtime.getURL('favicon-128x128.png'),
						title: `New ${activity} Transaction`,
						eventTime: tx?.sentAt.getTime(),
						message: `There is a new ${activity} transaction on your account (${getShortAddress(address)}).`,
						isClickable: true,
					})
					const { lastError } = browser.runtime
					if (lastError) {
						// eslint-disable-next-line @typescript-eslint/no-throw-literal
						throw lastError
					}
				}
			}
		})

		lastTxIds = newLastTxIds
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
	}
	isCheckingTransactions = false
}

const mutex = new Mutex()

const watch = async () => {
	const release = await mutex.acquire()

	await sharedStore.persist.rehydrate()
	const { selectKeystoreId, transactionNotificationsEnabled } = sharedStore.getState()

	const useStore = accountStore(selectKeystoreId)
	await useStore.persist.rehydrate()

	try {
		if (transactionNotificationsEnabled) {
			watchTransactions(selectKeystoreId, useStore)
		} else {
			lastTxIds = {}
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
	}

	release()
}

const BACKGROUND_EVENT = 'backgroundwatcher'

const triggerWatch = () => dispatchEvent(new CustomEvent(BACKGROUND_EVENT))

export default () => {
	// eslint-disable-next-line no-restricted-globals
	addEventListener(BACKGROUND_EVENT, watch)
	setInterval(triggerWatch, 1000 * 15) // 15 seconds
}