import { pipe } from 'fp-ts/function';
import produce from 'immer';
import { find } from 'mingo';
import { CollectionArea } from './collection-area';
import { GarbageTypeFrequency, nextDate } from './garbage-type-frequency';
import { getDatabase } from './database';
import { GarbageType } from './garbage-type';

export interface CollectionDistrict {
  name: string;
  nameJP: string;

  garbages: GarbageTypeFrequency[];

  addresses: CollectionArea[];
}

export const mapLocations = (district: CollectionDistrict) => {
  return district.addresses.map((address) => {
    return {
      lat: address.lat,
      lng: address.lng,
    };
  });
};

export const findDistrict = async (districtName: string) => {
  const db = await getDatabase();
  const district = pipe(
    find(db.districts ?? [], {
      name: districtName,
    }).next() as CollectionDistrict,
    (district) =>
      produce(district, (draft) => {
        draft.garbages.forEach((garbage) => {
          // TODO: use two properties for this
          garbage.garbage = find(db.garbages ?? [], {
            _id: garbage.garbage as string,
          }).next() as GarbageType;
        });
      })
  );

  return district;
};

export const findDistrictWithSortedSchedule = async (districtName: string) => {
  const district = await findDistrict(districtName);
  if (!district) {
    return;
  }
  const result = produce(district, (draft) => {
    draft.garbages.sort((a, b) => Number(nextDate(a)) - Number(nextDate(b)));
  });

  return result;
};
