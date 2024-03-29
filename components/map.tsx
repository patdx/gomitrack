import { FC } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  MapContainerProps,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
//   c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
//   C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

const html = String.raw;

const DIV_ICON = L.divIcon({
  className: 'border-0 bg-transparent',
  iconSize: [SIZE, SIZE],
  html: html`
    <svg
      height="20"
      viewBox="0 0 24 24"
      style="cursor:pointer;fill:#d00;stroke:none"
    >
      <path
        d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z"
      />
    </svg>
  `,
  // renderToStaticMarkup forbidden in Next.js 14...
  // renderToStaticMarkup(
  //   <svg
  //     height={SIZE}
  //     viewBox="0 0 24 24"
  //     style={{
  //       cursor: 'pointer',
  //       fill: '#d00',
  //       stroke: 'none',
  //     }}
  //   >
  //     <path d={ICON} />
  //   </svg>
  // ),
});

const Map: FC<{ locations?: any[]; mapContainerProps?: MapContainerProps }> = ({
  locations,
  mapContainerProps,
}) => {
  // TODO: we used to use MapTiler, but after the Mapbox plugin license changed,
  // switched to leaflet. no support for vector Tile at the moment.

  /* process.env.MAPS_URL */
  return (
    <MapContainer {...mapContainerProps}>
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
    </MapContainer>
  );
};

export default Map;
