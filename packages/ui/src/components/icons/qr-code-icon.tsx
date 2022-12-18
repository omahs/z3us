/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'
import { IconProps } from './types'

export const QrCodeIcon = React.forwardRef<SVGSVGElement, IconProps>((props, forwardedRef) => (
	<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" {...props} ref={forwardedRef}>
		<g>
			<polygon points="9.6,6.9 11,6.9 11,5.5 12.4,5.5 12.4,4.1 9.6,4.1 9.6,2.8 8.2,2.8 8.2,5.5 9.6,5.5 	" />
			<rect x="11" y="20.6" width="1.4" height="1.4" />
			<rect x="20.6" y="20.6" width="1.4" height="1.4" />
			<path d="M0,22h6.9v-6.9H0V22z M1.4,16.5h4.1v4.1H1.4V16.5z" />
			<polygon points="11,1.4 11,0 8.2,0 8.2,1.4 9.6,1.4 9.6,2.8 11,2.8 	" />
			<polygon points="1.4,8.2 0,8.2 0,9.6 2.8,9.6 2.8,8.2 	" />
			<rect x="12.4" y="5.5" width="1.4" height="1.4" />
			<rect x="12.4" width="1.4" height="4.1" />
			<rect x="2.8" y="17.9" width="1.4" height="1.4" />
			<polygon points="1.4,12.4 2.8,12.4 2.8,13.8 4.1,13.8 4.1,9.6 2.8,9.6 2.8,11 0,11 0,13.8 1.4,13.8 	" />
			<rect x="20.6" y="9.6" width="1.4" height="1.4" />
			<polygon
				points="17.9,8.2 17.9,9.6 16.5,9.6 16.5,8.2 13.8,8.2 13.8,9.6 12.4,9.6 12.4,8.2 8.2,8.2 8.2,6.9 6.9,6.9 6.9,8.2 
		5.5,8.2 5.5,9.6 6.9,9.6 6.9,12.4 8.2,12.4 8.2,11 9.6,11 9.6,13.8 11,13.8 11,11 15.1,11 15.1,12.4 12.4,12.4 12.4,13.8 
		15.1,13.8 15.1,15.1 16.5,15.1 16.5,11 17.9,11 17.9,12.4 19.2,12.4 19.2,15.1 20.6,15.1 20.6,13.8 22,13.8 22,12.4 20.6,12.4 
		20.6,11 19.2,11 19.2,9.6 20.6,9.6 20.6,8.2 	"
			/>
			<rect x="17.9" y="2.8" width="1.4" height="1.4" />
			<path d="M22,0h-6.9v6.9h5.5v1.4H22V0z M20.6,5.5h-4.1V1.4h4.1V5.5z" />
			<polygon points="19.2,16.5 19.2,17.9 20.6,17.9 20.6,19.2 22,19.2 22,15.1 20.6,15.1 20.6,16.5 	" />
			<rect x="8.2" y="13.8" width="1.4" height="2.8" />
			<polygon
				points="17.9,17.9 16.5,17.9 16.5,19.2 15.1,19.2 15.1,17.9 13.8,17.9 13.8,16.5 15.1,16.5 15.1,15.1 12.4,15.1 12.4,13.8 
		11,13.8 11,16.5 9.6,16.5 9.6,17.9 8.2,17.9 8.2,22 9.6,22 9.6,20.6 11,20.6 11,19.2 13.8,19.2 13.8,22 15.1,22 15.1,20.6 
		16.5,20.6 16.5,22 19.2,22 19.2,20.6 20.6,20.6 20.6,19.2 17.9,19.2 	"
			/>
			<rect x="5.5" y="12.4" width="1.4" height="1.4" />
			<rect x="2.8" y="2.8" width="1.4" height="1.4" />
			<rect x="16.5" y="15.1" width="1.4" height="1.4" />
			<path d="M0,0v6.9h6.9V0H0z M5.5,5.5H1.4V1.4h4.1V5.5z" />
		</g>
	</svg>
))

export default QrCodeIcon
