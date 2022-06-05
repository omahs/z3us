/* eslint-disable */
import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { NormalColors, NormalSizes } from '../../utils/prop-types'

const SIZES: NormalSizes[] = ['1', '2', '3', '4', '5', '6']
const COLORS: NormalColors[] = ['primary', 'primary', 'primary', 'secondary', 'tertiary', 'inverse', 'red', 'default']

import Button from './index'

export default {
	title: 'Z3US/Button',
	component: Button,
	argTypes: {
		children: {
			name: 'children',
			type: { name: 'string', required: false },
			defaultValue: 'Hello',
			description: 'The button text',
			table: {
				type: { summary: 'string', detail: 'Something really really long' },
				defaultValue: { summary: '-' },
			},
			control: {
				type: 'text',
			},
		},
		color: {
			description: 'Button color',
			table: {
				type: {
					summary: 'Button colors',
					detail: 'Something really really long',
				},
				defaultValue: { summary: '-' },
			},
			control: { type: 'select', options: COLORS },
		},
		size: {
			name: 'size',
			type: { name: 'string', required: false },
			defaultValue: '-',
			description: 'The button text',
			table: {
				type: { summary: 'string', detail: 'Something really really long' },
				defaultValue: { summary: '-' },
			},
			control: { type: 'select', options: SIZES },
		},
		clickable: {
			name: 'clickable',
			type: { name: 'boolean', required: false },
			defaultValue: 'true',
			description: 'Indicates if the button is clickabled',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'true' },
			},
		},
	},
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = args => <Button {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	color: 'primary',
	children: 'Button',
	size: '3',
}

export const Secondary = Template.bind({})
Secondary.args = {
	label: 'Button',
}
