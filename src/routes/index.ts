import express from 'express';
import { getLowDb, District } from '../db/low-db';
import { plainToClass } from 'class-transformer';
import { findDistrictWithSortedSchedule } from '../models/district';

export const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', async function(_req, res, _next) {
  const db = await getLowDb();

  const districts = db
    .get(['districts'])
    .orderBy(['name', 'addresses.addressJP'])
    .value();

  const districtsClass = plainToClass(District, districts);

  res.render('districts', {
    districts: districtsClass,
    title: 'Gomitrack',
  });
});

indexRouter.get('/districts/:district', function(req, res, _next) {
  const district = req.params.district;
  findDistrictWithSortedSchedule(district).then(function(data) {
    res.render('district', {
      district: data,
      locations: JSON.stringify(data.mapLocations),
      mapsURL:
        'https://maps.googleapis.com/maps/api/js?key=' +
        process.env.MAPS_API +
        '&callback=initMap',
      title: data.nameJP + ' ' + data.name,
    });
  });
});

indexRouter.get('/about', function(_req, res, _next) {
  res.render('about', {});
});
