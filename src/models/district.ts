import { plainToClass } from 'class-transformer';
import produce from 'immer';
import { pick } from 'lodash';
import { District, getLowDb } from '../db/low-db';

export const justNames = async () => {
  const db = await getLowDb();
  const districts = db
    .get('districts')
    .map(district => pick(district, 'name', 'nameJP'))
    .sortBy('name')
    .value();
  return districts;
};

export const findDistrict = async districtName => {
  const db = await getLowDb();
  const district = db
    .get('districts')
    .find({ name: districtName })
    .thru(district =>
      produce(district, draft => {
        draft.garbages.forEach(garbage => {
          garbage.garbage = db
            .get('garbages')
            .find({ _id: garbage.garbage as string })
            .value();
        });
      })
    )
    .thru(district => plainToClass(District, district))
    .value();

  return district;
};

export const findDistrictWithSortedSchedule = districtName => {
  return findDistrict(districtName).then(data => {
    if (!data) {
      return;
    }
    data.garbages.sort(function(a, b) {
      return Number(a.nextDate) - Number(b.nextDate);
    });
    return data;
  });
};
