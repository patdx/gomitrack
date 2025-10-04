import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router'
import { Link } from 'react-router'
import type { Route } from './+types/root'
import appleIcon from './apple-icon.png?url&no-inline'
import iconSvg from './icon.svg?url&no-inline'
import opengraphImage from './opengraph-image.png?url&no-inline'
import './app.css'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja-JP">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Gomitrack</title>
				<meta
					name="description"
					content="Garbage schedule for Kusatsu City, Shiga"
				/>
				<meta name="application-name" content="Gomitrack" />
				<meta name="apple-mobile-web-app-title" content="Gomitrack" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta property="og:title" content="Gomitrack" />
				<meta
					property="og:description"
					content="Garbage schedule for Kusatsu City, Shiga"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:image" content={opengraphImage} />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Gomitrack" />
				<meta
					name="twitter:description"
					content="Garbage schedule for Kusatsu City, Shiga"
				/>
				<meta name="theme-color" content="#ffffff" />
				<Links />
				<link rel="apple-touch-icon" sizes="180x180" href={appleIcon} />
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
				<link rel="icon" type="image/svg+xml" href={iconSvg} />
				<link rel="mask-icon" href={iconSvg} color="#5bbad5" />
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body>
				<nav className="border-b bg-white shadow-sm">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 justify-between">
							<div className="flex items-center">
								<Link to="/" className="text-xl font-bold text-gray-900">
									Gomitrack
								</Link>
							</div>
							<div className="flex items-center space-x-8">
								<Link
									to="/"
									className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
								>
									Districts
								</Link>
								<Link
									to="/about"
									className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
								>
									About
								</Link>
							</div>
						</div>
					</div>
				</nav>
				<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					{children}
				</main>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!'
	let details = 'An unexpected error occurred.'
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error'
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}
