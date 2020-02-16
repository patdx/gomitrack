import { Type } from './class-transformer';
import { memoize } from 'lodash';
import low, { AdapterAsync } from 'lowdb';
import { RRule } from 'rrule';
import { LowDbAdapter } from './low-db-adapter';
import { IncomingMessage } from 'http';
import { format } from 'date-fns';

export const getLowDb = memoize(async (req: IncomingMessage) => {
  const adapter = (new LowDbAdapter(
    req,
    '/db.json'
  ) as unknown) as AdapterAsync<AppDb>;
  const db = await low(adapter);
  await db
    .defaults({
      districts: [],
      garbages: [],
    } as AppDb)
    .write();
  return db;
});

export class GarbageItem {
  garbage!: string | GarbageType;
  frequency!: string;
  frequencyRRule!: string;

  nextDate() {
    // the rrule plugin only supports working in fake UTC format
    const localDate = new Date();
    const dateInFakeUtc = new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      )
    );

    const rrule = RRule.fromString(this.frequencyRRule);
    const nextDateInFakeUtc = rrule.after(dateInFakeUtc, true);

    const nextDate = new Date(
      nextDateInFakeUtc.getUTCFullYear(),
      nextDateInFakeUtc.getUTCMonth(),
      nextDateInFakeUtc.getUTCDate()
    );
    console.log(nextDateInFakeUtc, JSON.stringify(nextDateInFakeUtc));
    console.log(nextDate, JSON.stringify(nextDate));
    return nextDate;
  }

  nextDateFormatted() {
    return format(this.nextDate(), 'PPPP');
  }
}

export class Address {
  _id!: string;
  addressJP!: string;
  address!: string;
  zipcode!: string;
  lat!: number;
  lng!: number;

  zipcodePretty() {
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

  mapLocations() {
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
