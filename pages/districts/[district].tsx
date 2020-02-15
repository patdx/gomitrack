import { NextPage } from 'next';
import { findDistrictWithSortedSchedule } from '../../config/district';
import { District, GarbageType } from '../../config/low-db';
import { Layout } from '../../components/Layout';

const DistrictPage: NextPage<{
  district: District;
  locations: string;
  navDistricts?: any;
}> = ({ district, navDistricts }) => {
  return (
    <Layout navDistricts={navDistricts}>
      <h1>
        <span className="districtJP">{district.nameJP}</span>{' '}
        <span className="districtEN">{district.name}</span>
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
                <br />({garbage.frequency}) {garbage.nextDateFormatted}
              </div>
            );
          })}
        </div>
        <div className="col-xs-12 col-sm-8">
          <h2>Area</h2>

          <div id="map"></div>
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

          <div className="row">
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
                    <br />〒{address.zipcodePretty}
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

DistrictPage.getInitialProps = async context => {
  const districtName = context.query.district as string;
  const district = await findDistrictWithSortedSchedule(
    context.req!,
    districtName
  );

  if (!district) {
    throw new Error(`could not find district ${districtName}`);
  }

  return {
    district,
    locations: JSON.stringify(district.mapLocations),
  };
};

export default DistrictPage;
