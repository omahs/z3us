import React, { useState } from 'react'
import { useStore } from '@src/store'
import { useLocation } from 'wouter'
import Button from 'ui/src/components/button'
import { LockClosedIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { HardwareWalletIcon } from 'ui/src/components/icons'
import { Box, MotionBox } from 'ui/src/components/atoms'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuItemIndicator,
	DropdownMenuTriggerItem,
	DropdownMenuRightSlot,
	DropdownMenuHamburgerIcon,
} from 'ui/src/components/drop-down-menu'

export const WalletMenu: React.FC = () => {
	const [, setLocation] = useLocation()

	const { seed, theme, setTheme, networks, selectedNetworkIndex, selectNetwork, lock } = useStore(state => ({
		seed: state.masterSeed,
		theme: state.theme,
		setTheme: state.setThemeAction,

		networks: state.networks,
		selectedNetworkIndex: state.selectedNetworkIndex,
		selectNetwork: state.selectNetworkAction,
		lock: state.lockAction,
	}))
	const [isOpen, setIsopen] = useState(false)

	const handleSelectNetwork = async (value: string) => {
		await selectNetwork(+value)
	}

	const handleLockWallet = async () => lock()

	const handleConnectHW = () => {
		window.open(`${window.location.origin}/index.html#/hardware-wallet`)
		setLocation('#/hardware-wallet')
	}

	return (
		<MotionBox animate={isOpen ? 'open' : 'closed'}>
			<DropdownMenu onOpenChange={setIsopen}>
				<DropdownMenuTrigger asChild>
					<Button iconOnly aria-label="wallet options" color="ghost" size="3" css={{ mt: '2px', mr: '2px' }}>
						<DropdownMenuHamburgerIcon
							css={{
								stroke: isOpen ? '$iconDefault' : '$iconDefault',
								mt: isOpen ? '3px' : '2px',
							}}
						/>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					avoidCollisions={false}
					align="end"
					side="bottom"
					sideOffset={6}
					alignOffset={-5}
					css={{ minWidth: '130px' }}
				>
					<DropdownMenu>
						<DropdownMenuTriggerItem>
							<Box css={{ flex: '1', pr: '$1' }}>Theme</Box>
							<DropdownMenuRightSlot>
								<ChevronRightIcon />
							</DropdownMenuRightSlot>
						</DropdownMenuTriggerItem>
						<DropdownMenuContent avoidCollisions side="right" css={{ minWidth: '80px' }}>
							<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
								<DropdownMenuRadioItem value="light">
									<DropdownMenuItemIndicator />
									Light
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="dark">
									<DropdownMenuItemIndicator />
									Dark
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="system">
									<DropdownMenuItemIndicator />
									System
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTriggerItem>
							<Box css={{ flex: '1', pr: '$1' }}>Network</Box>
							<DropdownMenuRightSlot>
								<ChevronRightIcon />
							</DropdownMenuRightSlot>
						</DropdownMenuTriggerItem>
						<DropdownMenuContent side="right" css={{ minWidth: '100px' }}>
							<DropdownMenuRadioGroup value={String(selectedNetworkIndex)} onValueChange={handleSelectNetwork}>
								{networks?.map((network, idx) => (
									<DropdownMenuRadioItem key={network.id} value={String(idx)}>
										<DropdownMenuItemIndicator />
										{network.id}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					{seed && (
						<>
							<DropdownMenuItem onSelect={handleConnectHW}>
								<Box css={{ flex: '1', pr: '$4' }}>Connect hardware wallet</Box>
								<DropdownMenuRightSlot>
									<HardwareWalletIcon />
								</DropdownMenuRightSlot>
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={handleLockWallet}>
								<Box css={{ flex: '1' }}>Lock wallet</Box>
								<DropdownMenuRightSlot>
									<LockClosedIcon />
								</DropdownMenuRightSlot>
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</MotionBox>
	)
}