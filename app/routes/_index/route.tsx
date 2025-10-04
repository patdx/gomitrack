import mingo from 'mingo'
import { Link } from 'react-router'
import { formatZip } from '~/utils/collection-area'
import { getDatabase } from '~/utils/database'
import type { Route } from './+types/route'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Gomitrack - Districts' },
		{
			name: 'description',
			content: 'Garbage schedule for Kusatsu City, Shiga',
		},
	]
}

export async function loader({}: Route.LoaderArgs) {
	const db = await getDatabase()

	const districts = mingo
		.find<{
			addresses: any[]
			[key: string]: any
		}>(db.districts ?? [], {})
		.sort({
			name: 1,
			'addresses.addressJP': 1,
		})
		.all()

	return { districts }
}

export default function DistrictsPage({ loaderData }: Route.ComponentProps) {
	const { districts } = loaderData

	return (
		<>
			<h1 className="mb-8 text-3xl font-bold text-gray-900">Districts</h1>

			<div className="space-y-6">
				{districts.map((district, index) => {
					const { nameJP, name, addresses } = district

					return (
						<div
							key={index}
							className="rounded-lg border bg-white p-6 shadow-sm"
						>
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
								<div className="lg:col-span-1">
									<Link
										to={`/districts/${name}`}
										className="block rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
									>
										<div className="text-lg font-semibold text-gray-900">
											{nameJP}
										</div>
										<div className="text-sm text-gray-600">{name}</div>
									</Link>
								</div>
								<div className="lg:col-span-3">
									<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
										{addresses.map((addressItem, addressIndex) => {
											const { address, addressJP } = addressItem

											return (
												<Link
													key={addressIndex}
													to={`/districts/${encodeURIComponent(name)}`}
													className="block rounded-lg border bg-white p-3 text-left transition-shadow hover:shadow-md"
												>
													<div className="text-gray-900">{addressJP}</div>
													<div className="text-sm text-gray-600">{address}</div>
													<div className="mt-1 text-xs text-gray-500">
														〒{formatZip(addressItem)}
													</div>
												</Link>
											)
										})}
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}
