import React, { ElementType, ReactNode } from 'react'
import clsx from 'clsx'
import { sprinkles, Sprinkles } from '../system/sprinkles.css'
// import { sprinkles, Sprinkles } from '@/components/system/sprinkles.css'

import { Box } from '../box'
import * as styles from './typography.css'

const colorMap = {
	neutral: { lightMode: 'gray700', darkMode: 'stone500' },
	strong: { lightMode: 'gray900', darkMode: 'gray100' },
	code: { lightMode: 'stone200' },
	link: { lightMode: 'stone800', darkMode: 'stone100' },
	secondary: { lightMode: 'gray500', darkMode: 'gray400' },
	highlight: { lightMode: 'pink500' },
} as const

interface TextStyleProps {
	size?: keyof typeof styles.text
	color?: keyof typeof colorMap
	weight?: keyof typeof styles.weight
	align?: Sprinkles['textAlign']
	baseline?: boolean
	display?: Sprinkles['display']
	type?: Exclude<keyof typeof styles.font, 'brand' | 'heading'>
}

export interface TextProps extends TextStyleProps {
	component?: ElementType
	children: ReactNode
}

const defaultProps = {
	component: 'span',
	size: 'standard',
	color: 'neutral',
	weight: 'regular',
	align: 'left',
	baseline: false,
	display: 'block',
	type: 'body',
}

export const TextStyles = ({
	size = 'standard',
	color = 'neutral',
	weight = 'regular',
	type = 'body',
	align,
	baseline = true,
}: TextStyleProps) =>
	clsx(
		styles.font[type],
		baseline ? styles.text[size].trimmed : styles.text[size].untrimmed,
		styles.weight[weight],
		sprinkles({ color: colorMap[color], textAlign: align }),
	)

const Text = ({
	component = 'span',
	size,
	color,
	weight,
	align,
	baseline = false,
	type,
	display,
	children,
}: TextProps) => (
	<Box component={component} display={display} className={TextStyles({ size, color, weight, type, align, baseline })}>
		{children}
	</Box>
)

export default Text

Text.defaultProps = defaultProps
