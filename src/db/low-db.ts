import { memoize } from 'lodash';
import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { RRule } from 'rrule';
import moment from 'moment';
import {Type, plainToClass} from "class-transformer";

const adapter = new FileAsync<AppDb>('db.json');

export const getLowDb = memoize(() => low(adapter));

export class GarbageItem {
  garbage!: string;
  frequency!: string;
  frequencyRRule!: string;

  get nextDate() {
    const rruleObj = RRule.fromString(this.frequencyRRule);
    return rruleObj.after(new Date(), true);
  }

  get nextDateFormatted() {
    return moment(this.nextDate).format('dddd, M/D/YY');
  }
}

export class Address {
  _id!: string;
  addressJP!: string;
  address!: string;
  zipcode!: string;
  lat!: number;
  lng!: number;

  get zipcodePretty() {
    //adds the dash "1550000" --> "155-0000"
    return this.zipcode.slice(0, 3) + '-' + this.zipcode.slice(3);
  }
}

export class District {
  name!: string;
  nameJP!: string;

  @Type(() => GarbageItem)
  garbages!: GarbageItem[];

  @Type(() => Address)
  addresses!: Address[];

  get mapLocations() {
    return this.addresses.map(p => {
      return {
        lat: p.lat,
        lng: p.lng,
      };
    });
  }
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
