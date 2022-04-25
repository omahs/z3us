import React, { useEffect } from 'react'
import { useStore } from '@src/store'
import { useLocation } from 'wouter'
import { useImmer } from 'use-immer'
import { onBoardingSteps } from '@src/store/onboarding'
import { PageWrapper, PageHeading, PageSubHeading } from '@src/components/layout'
import Button from 'ui/src/components/button'
import { Flex, Text, Box } from 'ui/src/components/atoms'
import InputFeedBack from 'ui/src/components/input/input-feedback'

export const CreateWallet = (): JSX.Element => {
	const [, setLocation] = useLocation()

	const {
		mnemonic,
		password,
		setPassword,
		setMnemomic,
		isRestoreWorkflow,
		createWallet,
		setIsRestoreWorkflow,
		setOnboradingStep,
	} = useStore(state => ({
		mnemonic: state.mnemonic,
		password: state.password,
		createWallet: state.createWalletAction,
		setPassword: state.setPasswordAction,
		setMnemomic: state.setMnemomicAction,

		isRestoreWorkflow: state.isRestoreWorkflow,
		setIsRestoreWorkflow: state.setIsRestoreWorkflowAction,
		setOnboradingStep: state.setOnboardingStepAction,
	}))

	const [state, setState] = useImmer({
		isButtonDisabled: true,
		showError: false,
		errorMessage: '',
	})

	useEffect(() => {
		setState(draft => {
			draft.isButtonDisabled = !mnemonic || !password
		})
	}, [mnemonic, password])

	const handleContinue = async () => {
		setIsRestoreWorkflow(false)
		if (state.isButtonDisabled) {
			return
		}
		setState(draft => {
			draft.isButtonDisabled = true
		})
		try {
			await createWallet(mnemonic.words, password)
			setPassword(null)
			setMnemomic(null)
			setOnboradingStep(onBoardingSteps.START)
			setLocation('/wallet/account')
		} catch (error) {
			setState(draft => {
				draft.showError = true
				draft.errorMessage = (error?.message || error).toString().trim()
			})
		}
		setState(draft => {
			draft.isButtonDisabled = false
		})
	}

	return (
		<PageWrapper
			css={{
				flex: '1',
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				flexBasis: '100%',
			}}
		>
			<Box css={{ width: '100%' }}>
				<PageHeading>Created wallet</PageHeading>
				<PageSubHeading>
					Click &apos;Go to wallet&apos; below to navigate to your wallet and begin using your z3us wallet.
				</PageSubHeading>
			</Box>
			<Box css={{ mt: '$8', flex: '1' }}>
				<InputFeedBack showFeedback={state.showError} animateHeight={31}>
					<Text color="red" medium>
						{state.errorMessage}
					</Text>
				</InputFeedBack>
			</Box>
			<Flex css={{ width: '100%' }}>
				<Button
					fullWidth
					color="primary"
					size="6"
					onClick={handleContinue}
					css={{ flex: '1' }}
					disabled={state.isButtonDisabled}
					loading={state.isButtonDisabled}
				>
					Go to wallet
				</Button>
			</Flex>
			<Flex justify="center" align="center" css={{ height: '48px', ta: 'center', mt: '$2', width: '100%' }}>
				<Text medium size="3" color="muted">
					{isRestoreWorkflow ? 'Step 4 of 4 ' : 'Step 3 of 3'}
				</Text>
			</Flex>
		</PageWrapper>
	)
}
