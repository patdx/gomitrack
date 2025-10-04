'use client'

// Bootstrap components replaced with Tailwind CSS
// This file is kept for compatibility but components should be replaced with Tailwind equivalents

export const Alert = ({
	children,
	color = 'info',
}: {
	children: React.ReactNode
	color?: string
}) => (
	<div
		className={`rounded-lg border p-4 ${color === 'danger' ? 'border-red-200 bg-red-50 text-red-800' : 'border-blue-200 bg-blue-50 text-blue-800'}`}
	>
		{children}
	</div>
)

export const Button = ({
	children,
	color = 'primary',
	onClick,
	type = 'button',
}: {
	children: React.ReactNode
	color?: string
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
}) => (
	<button
		type={type}
		onClick={onClick}
		className={`rounded-lg px-4 py-2 font-medium transition-colors ${
			color === 'primary'
				? 'bg-blue-600 text-white hover:bg-blue-700'
				: color === 'secondary'
					? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
					: 'bg-gray-600 text-white hover:bg-gray-700'
		}`}
	>
		{children}
	</button>
)

export const Card = ({
	children,
	className = '',
}: {
	children: React.ReactNode
	className?: string
}) => (
	<div className={`rounded-lg border bg-white shadow-sm ${className}`}>
		{children}
	</div>
)

export const CardBody = ({ children }: { children: React.ReactNode }) => (
	<div className="p-4">{children}</div>
)

export const CardText = ({ children }: { children: React.ReactNode }) => (
	<p className="text-gray-600">{children}</p>
)

export const CardTitle = ({ children }: { children: React.ReactNode }) => (
	<h3 className="mb-2 text-lg font-semibold text-gray-900">{children}</h3>
)

// Empty exports for components we don't need anymore
export const Collapse = () => null
export const Col = ({ children }: { children: React.ReactNode }) => (
	<div>{children}</div>
)
export const Container = ({ children }: { children: React.ReactNode }) => (
	<div>{children}</div>
)
export const Nav = ({ children }: { children: React.ReactNode }) => (
	<nav>{children}</nav>
)
export const Navbar = ({ children }: { children: React.ReactNode }) => (
	<nav>{children}</nav>
)
export const NavItem = ({ children }: { children: React.ReactNode }) => (
	<div>{children}</div>
)
export const NavLink = ({ children }: { children: React.ReactNode }) => (
	<a>{children}</a>
)
export const Row = ({ children }: { children: React.ReactNode }) => (
	<div>{children}</div>
)
