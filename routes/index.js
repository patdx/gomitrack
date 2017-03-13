console.log("file:", __filename, "cwd:", process.cwd());

var express = require('express');
var router = express.Router();

var mongoose = require('../db/mongoose');

var User = require('../models/user');
var Garbage = require('../models/garbage');
var District = require('../models/district');

//used for districts.hbs
var RRule = require('rrule').RRule;
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index',{});
    res.redirect("districts");
});

router.get('/districts', function(req, res, next) {
    District.find({}).sort({
        "name": "1",
        "addresses.addressJP": "1"
    }).exec(function(err, docs) {
        if (err) throw err;
        res.render('districts', {
            districts: docs
        });
    });
})

router.get('/district/:district', function(req, res, next) {
    var district = req.params.district;
    District.findOne({
        name: district
    }).sort({
        "name": "1",
        "addresses.addressJP": "1"
    }).populate("garbages.garbage").exec(function(err, district) {
        if (err) throw err;

        district.garbages.forEach(function(garbage, index, array) {
            console.log(garbage);
            var rruleObj = RRule.fromString(garbage.frequencyRRule);
            var nextDate = rruleObj.after(new Date(), true);
            console.log(nextDate);

            //save the next date
            array[index].nextDate = nextDate;
            array[index].nextDateFormatted = moment(nextDate).format("dddd, M/D/YY");
        });

        district.garbages.sort(function(a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.nextDate - b.nextDate;
        });

        var locations = JSON.stringify(district.addresses.map(function(p) {
            return {
                lat: p.lat,
                lng: p.lng
            };
        }));
        res.render('district', {
            district: district,
            locations: locations,
            mapsURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.MAPS_API + "&callback=initMap"
        });
    });
})

module.exports = router;
