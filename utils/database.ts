import { IncomingMessage } from 'http';
import { memoize } from 'lodash';
import { CollectionDistrict } from './collection-district';
import { fetch } from './fetch';
import { GarbageType } from './garbage-type';

export const getDatabase = memoize(async (req?: IncomingMessage) => {
  const db = await fetch({ req, src: '/db.json' });

  return db;
});
export interface AppDatabase {
  garbages?: GarbageType[];
  districts?: CollectionDistrict[];
}
