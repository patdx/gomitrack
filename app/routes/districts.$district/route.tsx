import {
	findDistrictWithSortedSchedule,
	mapLocations,
} from '~/utils/collection-district'
import { DistrictPage } from './DistrictPage'
import type { Route } from './+types/route'

export function meta({ params }: Route.MetaArgs) {
	return [
		{ title: `Gomitrack - ${params.district}` },
		{
			name: 'description',
			content: `Garbage schedule for ${params.district} district`,
		},
	]
}

export async function loader({ params }: Route.LoaderArgs) {
	const districtName = decodeURIComponent(params.district)
	const district = await findDistrictWithSortedSchedule(districtName)

	if (!district) {
		throw new Response(`District ${districtName} not found`, { status: 404 })
	}

	return {
		district,
		locations: mapLocations(district),
	}
}

export default function DistrictRoute({ loaderData }: Route.ComponentProps) {
	return <DistrictPage {...loaderData} />
}
