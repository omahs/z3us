/* eslint-disable react/jsx-props-no-spreading, @typescript-eslint/no-unused-vars */
import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Box } from '../atoms/box'
import { Grid } from '../atoms/grid'
import { Flex } from '../atoms/flex'
import { QrCodeIcon, SwapIcon } from '../icons'

import { StyledSlider, StyledTrack, StyledRange, StyledThumb } from './index'

const SliderComponent = () => (
	<StyledSlider
		defaultValue={[2]}
		max={20}
		step={1}
		onValueChange={() => {}}
		css={{ width: '100%' }}
		aria-label="Volume"
	>
		<StyledTrack>
			<StyledRange />
		</StyledTrack>
		<StyledThumb />
	</StyledSlider>
)

export default {
	title: 'z3us components/Slider',
	component: SliderComponent,
	argTypes: {
		backgroundColor: { control: 'color' },
	},
} as ComponentMeta<typeof SliderComponent>

const Template: ComponentStory<typeof SliderComponent> = args => <SliderComponent />

const CombinedTemplate: React.FC = () => (
	<Box>
		<Flex justify="start">
			<Grid flow="column" gap="4">
				<Box css={{ width: '200px' }}>
					<SliderComponent />
				</Box>
			</Grid>
		</Flex>
	</Box>
)

export const Playground = CombinedTemplate

export const Primary = Template.bind({})
Primary.args = {
	placeholder: 'Test',
}
