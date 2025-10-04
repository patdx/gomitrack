import type { Route } from './+types/route'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Gomitrack - About' },
		{ name: 'description', content: 'About Gomitrack garbage schedule app' },
	]
}

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-4xl p-6">
			<h1 className="mb-8 text-3xl font-bold text-gray-900">About</h1>

			<div className="prose prose-lg max-w-none">
				<p className="mb-6 text-gray-700">
					This site tracks the garbage schedule in Kusatsu City. Created by{' '}
					<a
						href="https://www.pmil.me/"
						className="text-blue-600 underline hover:text-blue-800"
					>
						Patrick Miller
					</a>
					.
				</p>

				<h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">
					Credits
				</h2>

				<p className="mb-4 text-gray-700">
					<a
						href="https://www.city.kusatsu.shiga.jp/shisei/opendata/genryo120160129.html"
						className="text-blue-600 underline hover:text-blue-800"
					>
						Garbage collection data
					</a>{' '}
					by{' '}
					<a
						href="https://www.city.kusatsu.shiga.jp"
						className="text-blue-600 underline hover:text-blue-800"
					>
						Kusatsu City
					</a>{' '}
					is licensed under{' '}
					<a
						href="https://creativecommons.org/licenses/by/4.0/deed.ja"
						className="text-blue-600 underline hover:text-blue-800"
					>
						CC BY 4.0
					</a>
					.
				</p>

				<p className="text-gray-700">
					(Note that the data is not currently posted on the website.)
				</p>
			</div>
		</div>
	)
}
