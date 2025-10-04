import type { FC } from 'react'
import MapLibre, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

const Map: FC<{
	locations?: {
		lat: number
		lng: number
	}[]
	bounds: number[]
}> = ({ locations, bounds }) => {
	// TODO: we used to use MapTiler, but after the Mapbox plugin license changed,
	// switched to leaflet. no support for vector Tile at the moment.

	/* process.env.MAPS_URL */
	return (
		<>
			<MapLibre
				initialViewState={{
					bounds: bounds as any,
					fitBoundsOptions: {
						padding: 100,
						maxZoom: 14,
					},
				}}
				mapStyle="https://tiles.openfreemap.org/styles/liberty"
			>
				{locations?.map((location, index) => {
					console.log(location)

					return (
						<Marker
							key={`marker-${index}`}
							latitude={location.lat}
							longitude={location.lng}
							// icon={DIV_ICON}
						>
							<svg
								style={{
									width: 20,
									height: 20,
									cursor: 'pointer',
									fill: '#d00',
									stroke: 'none',
								}}
								viewBox="0 0 24 24"
							>
								<path
									d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z"
								/>
							</svg>
						</Marker>
					)
				})}
			</MapLibre>
			{/* <MapContainer {...mapContainerProps}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations?.map((location, index) => {
        return (
          <Marker
            key={`marker-${index}`}
            position={location}
            icon={DIV_ICON}
          ></Marker>
        );
      })}
    </MapContainer> */}
		</>
	)
}

export { Map }
export default Map
