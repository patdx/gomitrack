import type { Route } from './+types/route'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Gomitrack - About' },
		{ name: 'description', content: 'About Gomitrack garbage schedule app' },
	]
}

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-4xl">
			<h1 className="mb-8 text-3xl font-bold text-gray-900">About Gomitrack</h1>

			<div className="prose prose-lg max-w-none">
				<p className="mb-6 text-gray-700">
					Gomitrack provides garbage collection schedules for Kusatsu City,
					Shiga Prefecture, Japan.
				</p>

				<h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">
					Features
				</h2>
				<ul className="list-disc space-y-2 pl-6 text-gray-700">
					<li>District-specific garbage collection schedules</li>
					<li>Interactive maps showing collection areas</li>
					<li>Support for multiple garbage types</li>
					<li>Mobile-friendly responsive design</li>
				</ul>

				<h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">
					How to Use
				</h2>
				<ol className="list-decimal space-y-2 pl-6 text-gray-700">
					<li>Select your district from the main page</li>
					<li>View your garbage collection schedule</li>
					<li>Check the map for your specific collection area</li>
				</ol>
			</div>
		</div>
	)
}
