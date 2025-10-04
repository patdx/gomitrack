import { memoize } from 'lodash'
import type { CollectionDistrict } from './collection-district'
import type { GarbageType } from './garbage-type'

export const getDatabase = memoize(async () => {
	const db = await import('./db.json')
	return db.default
	// const db = await fetchJson({ req, src: '/db.json' });

	// return db;
})

export interface AppDatabase {
	garbages?: GarbageType[]
	districts?: CollectionDistrict[]
}
