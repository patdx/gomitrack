'use client'

import { useState } from 'react'
import bbox from '@turf/bbox'
import { lineString } from '@turf/helpers'
import { formatZip } from '~/utils/collection-area'
import type { CollectionDistrict } from '~/utils/collection-district'
import type { GarbageType } from '~/utils/garbage-type'
import { FormatDate, nextDate } from '~/utils/garbage-type-frequency'
import { Map } from '~/components/map'

interface DistrictPageProps {
	district: CollectionDistrict
	locations: { lat: number; lng: number }[]
}

export function DistrictPage({ district, locations }: DistrictPageProps) {
	const [[minX, minY, maxX, maxY]] = useState(() => {
		const line = lineString(locations.map(({ lat, lng }) => [lng, lat]))
		const calculated = bbox(line)
		return calculated
	})

	return (
		<>
			<h1 className="mb-8 text-3xl font-bold text-gray-900">
				<span className="block text-2xl font-normal text-gray-600">
					{district?.nameJP}
				</span>
				{district?.name}
			</h1>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<h2 className="mb-4 text-xl font-semibold text-gray-900">Schedule</h2>

					<div className="space-y-3">
						{district.garbages.map((garbage, index) => {
							return (
								<div
									key={index}
									className="rounded-lg border bg-white p-4 shadow-sm"
								>
									<div className="font-semibold text-gray-900">
										<span className="block text-lg">
											{(garbage.garbage as GarbageType).nameJP}
										</span>
										<span className="text-sm text-gray-600">
											{(garbage.garbage as GarbageType).name}
										</span>
									</div>
									<div className="mt-2 text-sm text-gray-600">
										({garbage.frequency}){' '}
										<span className="font-medium text-gray-900">
											<FormatDate date={nextDate(garbage)} />
										</span>
									</div>
								</div>
							)
						})}
					</div>
				</div>
				<div className="lg:col-span-2">
					<h2 className="mb-4 text-xl font-semibold text-gray-900">Area</h2>

					<div
						className="overflow-hidden rounded-lg border bg-white shadow-sm"
						style={{ height: 400 }}
					>
						<Map locations={locations} bounds={[minX, minY, maxX, maxY]} />
					</div>

					<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
						{district.addresses.map((address, index) => {
							return (
								<div key={index} className="rounded-lg bg-gray-50 p-4">
									<div className="font-medium text-gray-900">
										{address.addressJP}
									</div>
									<div className="mt-1 text-sm text-gray-600">
										{address.address}
									</div>
									<div className="mt-2 text-xs text-gray-500">
										〒{formatZip(address)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}
