import { NextPage } from 'next';
import { findDistrictWithSortedSchedule } from '../../config/district';
import { District, GarbageType } from '../../config/low-db';
import { Layout } from '../../components/Layout';
import { plainToClass } from 'class-transformer';
import ReactMapGL, { Marker, WebMercatorViewport } from 'react-map-gl';
import { lineString } from '@turf/helpers';
import bbox from '@turf/bbox';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

import { useState } from 'react';

const DistrictPage: NextPage<{
  district: District;
  locations: { lat: number; lng: number }[];
}> = ({ district: plainDistrict, locations }) => {
  const district = plainToClass(District, plainDistrict);

  const [viewport, setViewport] = useState(() => {
    const line = lineString(locations.map(({ lat, lng }) => [lng, lat]));

    // minX, minY, maxX, maxY
    const myBbox = bbox(line);

    const idealViewPort = new WebMercatorViewport({
      zoom: 20,
    }).fitBounds([
      [myBbox[0], myBbox[1]],
      [myBbox[2], myBbox[3]],
    ]);

    return {
      latitude: idealViewPort.latitude,
      longitude: idealViewPort.longitude,
      zoom: 12,
    };
  });

  return (
    <Layout>
      <h1>
        <span className="districtJP">{district?.nameJP}</span>{' '}
        <span className="districtEN">{district?.name}</span>
      </h1>

      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <h2>Schedule</h2>

          {district.garbages.map((garbage, index) => {
            return (
              <div className="garbages" key={index}>
                <b>
                  <span className="nameJP">
                    {(garbage.garbage as GarbageType).nameJP}
                  </span>
                  <br />
                  <span className="nameEN">
                    {(garbage.garbage as GarbageType).name}
                  </span>
                </b>
                <br />({garbage.frequency}) {garbage.nextDateFormatted()}
              </div>
            );
          })}
        </div>
        <div className="col-xs-12 col-sm-8">
          <h2>Area</h2>

          <ReactMapGL
            {...viewport}
            onViewportChange={setViewport}
            mapStyle={process.env.MAPS_URL}
            width="100%"
            height="300px"
          >
            {locations.map((location, index) => {
              return (
                <Marker
                  key={`marker-${index}`}
                  longitude={location.lng}
                  latitude={location.lat}
                >
                  <svg
                    height={SIZE}
                    viewBox="0 0 24 24"
                    style={{
                      cursor: 'pointer',
                      fill: '#d00',
                      stroke: 'none',
                      transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
                    }}
                    // onClick={() => onClick(city)}
                  >
                    <path d={ICON} />
                  </svg>
                </Marker>
              );
            })}
          </ReactMapGL>

          {/* <script id='locations' data-locations="{{locations}}"></script>
      <script>
        var locations = JSON.parse(document.getElementById("locations").getAttribute("data-locations"));
                var map;
                var geocoder;

                function initMap() {
                    geocoder = new google.maps.Geocoder();

                    map = new google.maps.Map(document.getElementById('map'), {
                        center: {
                            lat: 35.013134,
                            lng: 135.959936
                        },
                        zoom: 13,
                        disableDefaultUI: true,
                        draggable: false,
                        scrollwheel: false,
                        disableDoubleClickZoom: true
                    });

                    var bounds = new google.maps.LatLngBounds(); //make bounds based off address points

                    locations.forEach(function(p) {
                        var marker = new google.maps.Marker({
                            map: map,
                            position: p
                        });
                        bounds.extend(p);
                    });

                    map.fitBounds(bounds);

                    google.maps.event.addDomListener(window, "resize", function() {
                        google.maps.event.trigger(map, "resize");
                        map.fitBounds(bounds);
                        //if window resizes recenter on bounds
                    });
                }
      </script>
      <script src="{{{mapsURL}}}" async defer></script> */}

          <div className="row mt-2">
            {district.addresses.map((address, index) => {
              return (
                <div
                  className="col-xs-12 col-sm-6 col-md-4 col-lg-4"
                  key={index}
                >
                  <div className="addresses">
                    {address.addressJP}
                    <br />
                    {address.address}
                    <br />〒{address.zipcodePretty()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const unstable_getServerProps = async (context: any) => {
  const districtName = context.query.district as string;
  const district = await findDistrictWithSortedSchedule(
    context.req!,
    districtName
  );

  if (!district) {
    throw new Error(`could not find district ${districtName}`);
  }

  return {
    props: {
      district,
      locations: district.mapLocations(),
    },
  };
};

export default DistrictPage;
