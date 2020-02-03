console.log('file:', __filename, 'cwd:', process.cwd());

import express from 'express';
import { District, findDistrictWithSortedSchedule } from '../models/district';
import { getLowDb } from '../db/low-db';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  getLowDb().then(db => {
    db.get(['districts']).orderBy({});
  });
  District.find({})
    .sort({
      name: '1',
      'addresses.addressJP': '1',
    })
    .exec(function(err, docs) {
      if (err) throw err;
      res.render('districts', {
        districts: docs,
        title: 'Gomitrack',
      });
    });
});

router.get('/districts/:district', function(req, res, next) {
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

router.get('/about', function(req, res, next) {
  res.render('about', {});
});

export default router;
