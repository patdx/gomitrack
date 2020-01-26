console.log('file:', __filename, 'cwd:', process.cwd());

var express = require('express');
var router = express.Router();

var mongoose = require('../db/mongoose-load').mongoose;
var User = require('../models/user');
var Garbage = require('../models/garbage');
var District = require('../models/district');

//used for districts.hbs
var RRule = require('rrule').RRule;
var moment = require('moment');

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
