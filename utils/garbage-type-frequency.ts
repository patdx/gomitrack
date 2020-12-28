import RRule from 'rrule';
import { GarbageType } from "./garbage-type";
import { format } from 'date-fns';

export interface GarbageTypeFrequency {
  garbage: string | GarbageType;
  frequency: string;
  frequencyRRule: string;
}

export const nextDate = (garbageItem: GarbageTypeFrequency) => {
  // the rrule plugin only supports working in fake UTC format
  // for now, on SSR, it will be calculated from real UTC, I guess,
  // but ideally we want to calculate in Japanese time zone always

  const localDate = new Date();
  const dateInFakeUtc = new Date(
    Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
  );

  const rrule = RRule.fromString(garbageItem.frequencyRRule);
  const nextDateInFakeUtc = rrule.after(dateInFakeUtc, true);

  const nextDate = new Date(
    nextDateInFakeUtc.getUTCFullYear(),
    nextDateInFakeUtc.getUTCMonth(),
    nextDateInFakeUtc.getUTCDate()
  );
  console.log(nextDateInFakeUtc, JSON.stringify(nextDateInFakeUtc));
  console.log(nextDate, JSON.stringify(nextDate));
  return nextDate;
};

export const nextDateFormatted = (garbageItem: GarbageTypeFrequency) => {
  return format(nextDate(garbageItem), 'PPPP');
};
