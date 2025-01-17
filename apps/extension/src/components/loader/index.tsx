import React, { useEffect } from 'react'
import { useAnimationControls } from 'framer-motion'
import { useColorMode } from '@src/hooks/use-color-mode'
import { Box, Flex, MotionBox } from 'ui/src/components/atoms'
import { Z3USLogoOuter, Z3USLogoInner } from '../z3us-logo'

export const Loader: React.FC = () => {
	const isDarkMode = useColorMode()
	const z3usLogoControls = useAnimationControls()
	const z3usLogoSpinnerControls = useAnimationControls()

	const fillZ3usPurple = '#8457FF'
	const logoFill = isDarkMode ? '#323232' : '#FFFFFF'
	const logoBackgroundStart = isDarkMode ? '#1F1F1F' : '#DBDBDB'
	const logoBackgroundEnd = isDarkMode ? '#323232' : '#FFFFFF'
	const logoShadow = isDarkMode ? '0px 10px 44px rgba(0, 0, 0, 0.35)' : '0px 10px 34px rgba(0, 0, 0, 0.15)'

	useEffect(() => {
		z3usLogoControls.start({
			fill: logoFill,
			backgroundColor: logoBackgroundEnd,
			transition: { duration: 0.1, ease: 'anticipate' },
		})
		z3usLogoSpinnerControls.start({
			rotate: [null, 360],
			transition: {
				delay: 0.1,
				duration: 5,
				repeat: Infinity,
				ease: 'linear',
			},
		})
		z3usLogoControls.start({
			y: '96px',
			fill: fillZ3usPurple,
			transition: { duration: 0.1, ease: 'anticipate' },
		})
	}, [])

	return (
		<Flex align="center" justify="center" css={{ flex: '1', position: 'relative' }}>
			<MotionBox
				animate={z3usLogoControls}
				css={{
					width: '232px',
					height: '232px',
					borderRadius: '50%',
					position: 'absolute',
					top: '40px',
					left: '50%',
					marginLeft: '-116px',
					transition: '$default',
					zIndex: '99',
					boxShadow: logoShadow,
					fill: logoFill,
					backgroundColor: logoBackgroundStart,
				}}
			>
				<MotionBox
					animate={z3usLogoSpinnerControls}
					css={{ width: '232px', height: '232px', position: 'absolute', top: '0', left: '0' }}
				>
					<Z3USLogoOuter />
				</MotionBox>
				<Box
					css={{
						width: '168px',
						height: '168px',
						position: 'absolute',
						top: '32px',
						left: '32px',
					}}
				>
					<Z3USLogoInner />
				</Box>
			</MotionBox>
		</Flex>
	)
}
