import React from 'react'
import { Text, Box, Flex, StyledLink } from 'ui/src/components/atoms'
import Link from 'next/link'
import { Container } from 'components/container'

import { Grid } from '@nextui-org/react'
import { Z3usLogoText } from 'ui/src/components/z3us-logo-text'

export const Footer: React.FC = () => (
	<Box css={{ bg: '$bgPanelFooter', border: '1px solid $borderPanelFooter', pb: '20px' }}>
		<Container>
			<Grid.Container
				gap={2}
				justify="center"
				css={{
					position: 'relative',
				}}
			>
				<Grid xs={6}>
					<Flex align="center" css={{ py: '30px', '@xs': { px: '24px' }, '@md': { px: '0' } }}>
						<Box>
							<Link href="/">
								<a>
									<Z3usLogoText css={{ color: '$txtHelp' }} />
								</a>
							</Link>
							<Box css={{ mt: '$2', display: 'block' }}>
								<Text color="muted">&copy; {new Date().getFullYear()} Z3US</Text>
							</Box>
						</Box>
					</Flex>
				</Grid>
				<Grid xs={6}>
					<Flex
						align="center"
						justify="end"
						gap="3"
						css={{ flex: '1', color: '$txtHelp', py: '30px', '@xs': { px: '24px' }, '@md': { px: '0' } }}
					>
						<Link href="/privacy" passHref>
							<StyledLink underlineOnHover>
								<Text>Privacy</Text>
							</StyledLink>
						</Link>
						<Link href="/terms" passHref>
							<StyledLink underlineOnHover>
								<Text>Terms</Text>
							</StyledLink>
						</Link>
					</Flex>
				</Grid>
			</Grid.Container>
		</Container>
	</Box>
)
