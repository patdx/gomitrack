import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { memoize } from 'lodash';
const adapter = new FileAsync<AppDb>('db.json');

export const getLowDb = memoize(() => low(adapter));

export interface GarbageItem {
  garbage: string;
  frequency: string;
  frequencyRRule: string;
}

export interface District {
  name: string;
  nameJP: string;
  garbages: GarbageItem[];
}

export interface GarbageType {
  _id: string;
  name: string;
  nameJP: string;
  disposal: string;
  disposalJP: string;
  calendarColor: string;
}

export interface AppDb {
  garbages: GarbageType[];
  districts: District[];
}

