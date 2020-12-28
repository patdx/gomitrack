import bbox from '@turf/bbox';
import { lineString } from '@turf/helpers';
import { pipe } from 'fp-ts/pipeable';
import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import ReactMapGL, { Marker, WebMercatorViewport } from 'react-map-gl';
import { Card, CardBody } from 'reactstrap';
import { Layout } from '../../components/Layout';
import { formatZip } from '../../utils/collection-area';
import { CollectionDistrict, findDistrictWithSortedSchedule, mapLocations } from '../../utils/collection-district';
import { GarbageType } from "../../utils/garbage-type";
import { nextDateFormatted } from '../../utils/garbage-type-frequency';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

const DistrictPage: NextPage<{
  district: CollectionDistrict;
  locations: { lat: number; lng: number }[];
}> = ({ district, locations }) => {
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
              <Card key={index} className="shadow my-2">
                <CardBody>
                  <b>
                    <span className="nameJP">
                      {(garbage.garbage as GarbageType).nameJP}
                    </span>
                    <br />
                    <span className="nameEN">
                      {(garbage.garbage as GarbageType).name}
                    </span>
                  </b>
                  <br />({garbage.frequency}) {pipe(garbage, nextDateFormatted)}
                </CardBody>
              </Card>
              // <div className="garbages" key={index}>

              // </div>
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
                    <br />〒{formatZip(address)}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const districtName = context.query.district as string;
  const district = await findDistrictWithSortedSchedule(
    districtName,
    context.req
  );

  if (!district) {
    throw new Error(`could not find district ${districtName}`);
  }

  return {
    props: JSON.parse(
      JSON.stringify({
        district,
        locations: mapLocations(district),
      })
    ),
  };
};

export default DistrictPage;
