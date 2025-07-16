'use client';

import bbox from '@turf/bbox';
import { lineString } from '@turf/helpers';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { formatZip } from '../../../utils/collection-area';
import { CollectionDistrict } from '../../../utils/collection-district';
import { GarbageType } from '../../../utils/garbage-type';
import { FormatDate, nextDate } from '../../../utils/garbage-type-frequency';

const Map = dynamic(() => import('../../../components/map'), { ssr: false });

export const ClientDistrictPage: NextPage<{
  district: CollectionDistrict;
  locations: { lat: number; lng: number }[];
}> = ({ district, locations }) => {
  const [[minX, minY, maxX, maxY]] = useState(() => {
    // TODO: we can do this with the built-in leaflet logic
    const line = lineString(locations.map(({ lat, lng }) => [lng, lat]));

    // minX, minY, maxX, maxY
    const calculated = bbox(line);
    return calculated;
  });

  return (
    <>
      <h1>
        <span className="districtJP">{district?.nameJP}</span>{' '}
        <span className="districtEN">{district?.name}</span>
      </h1>

      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <h2>Schedule</h2>

          {district.garbages.map((garbage, index) => {
            return (
              <div key={index} className="card shadow my-2">
                <div className="card-body">
                  <b>
                    <span className="nameJP">
                      {(garbage.garbage as GarbageType).nameJP}
                    </span>
                    <br />
                    <span className="nameEN">
                      {(garbage.garbage as GarbageType).name}
                    </span>
                  </b>
                  <br />({garbage.frequency}){' '}
                  <FormatDate date={nextDate(garbage)} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-xs-12 col-sm-8">
          <h2>Area</h2>

          <div style={{ height: 400 }}>
            <Map locations={locations} bounds={[minX, minY, maxX, maxY]} />
          </div>

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
    </>
  );
};
