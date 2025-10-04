import type { Route } from './+types/route'
import icon192 from '../../assets/android-chrome-192x192.png?url'
import icon512 from '../../assets/android-chrome-512x512.png?url'

export function loader({}: Route.LoaderArgs) {
	return Response.json({
		name: 'Gomitrack',
		short_name: 'Gomitrack',
		description: 'Garbage schedule for Kusatsu City, Shiga',
		start_url: '/',
		display: 'standalone',
		background_color: '#fff',
		theme_color: '#fff',
		icons: [
			{
				src: icon192,
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: icon512,
				sizes: '512x512',
				type: 'image/png',
			},
		],
	})
}
