import { Page, ChromiumBrowserContext } from 'playwright'
import { closePages, initBrowserWithExtension } from './util'

let page: Page
let browserContext: ChromiumBrowserContext
let extensionURL: string

const DELAY = 3000

describe('The Extension page should', () => {
	beforeAll(async () => {
		const init = await initBrowserWithExtension()
		browserContext = init.browserContext
		extensionURL = init.extensionURL
		page = init.page
	})

	afterAll(async () => {
		await browserContext?.close()
		browserContext = null
		page = null
		extensionURL = ''
	})

	beforeEach(async () => {
		if (!extensionURL) {
			// eslint-disable-next-line no-console
			console.error('Invalid extensionURL', { extensionURL })
		}
		await page.bringToFront()
		await page.goto(extensionURL)
		await page.waitForTimeout(1000)
		await closePages(browserContext)
	})

	afterEach(async () => {
		await closePages(browserContext)
	})

	it('see the Z3US onboading ui with `BETA` pill', async () => {
		const pillSelector = '[data-test-e2e="pill"]'
		const extOnBoardingPill = await page.$$(pillSelector)
		expect(extOnBoardingPill).toHaveLength(1)

		const pillText = await page.$eval(pillSelector, el => el.innerHTML)
		expect(pillText).toEqual('BETA')

		const shadowElem = await page.$(pillSelector)
		const shadowElemText = await shadowElem.innerHTML()
		expect(shadowElemText).toBe('BETA')
	})

	it('should be able to create new wallet', async () => {
		const newWalletButtonSelector = '[data-test-e2e="create-new-wallet"]'
		const newWalletBtn = await page.$$(newWalletButtonSelector)
		expect(newWalletBtn).toHaveLength(1)

		// click `new wallet button`
		const pageNewWalletBtn = await page.$(newWalletButtonSelector)
		await pageNewWalletBtn.click()
		await page.waitForTimeout(DELAY)

		// expect the secret phrase to have 24 words
		const mnemonicWordsSelector = '[data-test-e2e="create-new-wallet-mnemonic"] span'
		const mnemonicWords = await page.$$eval(mnemonicWordsSelector, nodes => nodes.map(node => node.innerHTML))
		expect(mnemonicWords).toHaveLength(24)

		// When user clicks the `Save` button
		const savePhraseBtnSelector = '[data-test-e2e="create-new-wallet-save-btn"]'
		const savePhraseBtn = await page.$(savePhraseBtnSelector)
		await savePhraseBtn.click()
		await page.waitForTimeout(DELAY)

		// user enters password for wallet
		const PASSWORD = 'jdfj__$$#12'
		const passwordOneSelector = '[data-test-e2e="wallet-confirm-password-one"]'
		const passwordTwoSelector = '[data-test-e2e="wallet-confirm-password-two"]'
		const passwordOne = await page.$(passwordOneSelector)
		const passwordTwo = await page.$(passwordTwoSelector)
		await passwordOne.fill(PASSWORD)
		await passwordTwo.fill(PASSWORD)

		await page.waitForTimeout(DELAY)
	})
})
