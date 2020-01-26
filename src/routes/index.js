console.log('file:', __filename, 'cwd:', process.cwd());

import express from 'express';
var router = express.Router();

import { mongoose } from '../db/mongoose-load';
import User from '../models/user';
import Garbage from '../models/garbage';
import District from '../models/district';

//used for districts.hbs
import { RRule } from 'rrule';

import moment from 'moment';

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
  var district = req.params.district;
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

module.exports = router;
