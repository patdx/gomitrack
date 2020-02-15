import { plainToClass } from './class-transformer';
import produce from 'immer';
import { pick } from 'lodash';
import { getLowDb, District } from './low-db';
import { IncomingMessage } from 'http';

export const justNames = async (req: IncomingMessage) => {
  const db = await getLowDb(req);
  const districts = db
    .get('districts')
    .map(district => pick(district, 'name', 'nameJP'))
    .sortBy('name')
    .value();
  return districts;
};

export const findDistrict = async (req: IncomingMessage, districtName: string) => {
  const db = await getLowDb(req);
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

export const findDistrictWithSortedSchedule = async (req: IncomingMessage, districtName: string) => {
  const data = await findDistrict(req, districtName);
  if (!data) {
    return;
  }
  data.garbages.sort((a, b) => Number(a.nextDate) - Number(b.nextDate));
  return data;
};
