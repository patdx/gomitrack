import { RRule } from 'rrule'
import type { GarbageType } from './garbage-type'
import { DateTime } from 'luxon'

export interface GarbageTypeFrequency {
	garbage: string | GarbageType
	frequency: string
	frequencyRRule: string
}

export const nextDate = (garbageItem: GarbageTypeFrequency) => {
	// the rrule plugin only supports working in fake UTC format
	// for now, on SSR, it will be calculated from real UTC, I guess,
	// but ideally we want to calculate in Japanese time zone always

	const localDate = new Date()
	const dateInFakeUtc = new Date(
		Date.UTC(
			localDate.getFullYear(),
			localDate.getMonth(),
			localDate.getDate(),
		),
	)

	const rrule = RRule.fromString(garbageItem.frequencyRRule)
	const nextDateInFakeUtc = rrule.after(dateInFakeUtc, true)

	// TODO: review is this is corrcct
	const nextDate = DateTime.fromJSDate(nextDateInFakeUtc!)
		.toUTC()
		.setZone('local', { keepLocalTime: true })
		.setZone('Asia/Tokyo')

	// console.log('fake next date:', nextDateInFakeUtc, 'real next date', nextDate);

	return nextDate
}

export const nextDateFormatted = (garbageItem: GarbageTypeFrequency) => {
	return nextDate(garbageItem).toLocaleString(DateTime.DATE_FULL)
	// return format(nextDate(garbageItem), 'PPPP');
}

export function FormatDate({ date }: { date?: DateTime | null }) {
	if (!date) {
		return null
	}

	return (
		<time dateTime={date.toJSON() ?? undefined} suppressHydrationWarning>
			{date.toLocaleString(DateTime.DATE_FULL)}
		</time>
	)
}
