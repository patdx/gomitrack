console.log('file:', __filename, 'cwd:', process.cwd());

import express from 'express';
import {District} from '../models/district';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
  District.findDistrictWithSortedSchedule(district).then(function(data) {
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
