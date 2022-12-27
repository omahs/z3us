import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Z3usText } from 'ui/src/components/z3us-text'

import './navigation.css'

export const Navigation: React.FC = () => {
	const a = 1
	return (
		<nav className="z3-c-accounts_navigation">
			<Link to="/accounts/all">
				Z3
				{/* <Z3usText className="z3-c-accounts_navigation__logo" /> */}
			</Link>
			<ul>
				<li>
					<Link to="/accounts/all">Accounts</Link>
				</li>
				{/* <li className="opacity-50"> */}
				{/* 	<Link to="/accounts/acc-877">Account id</Link> */}
				{/* </li> */}
				{/* <li className="opacity-50"> */}
				{/* 	<Link to="/accounts/acc-877/xrd">Account id token</Link> */}
				{/* </li> */}
				<li>
					<Link to="/accounts/transfer">Transfer</Link>
				</li>
				<li>
					<Link to="/accounts/staking">Staking</Link>
				</li>
				<li>
					<Link to="/accounts/swap">Swap</Link>
				</li>
				<li>
					<Link to="/accounts/settings">Settings</Link>
				</li>
			</ul>
		</nav>
	)
}
