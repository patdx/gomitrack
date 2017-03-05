var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var env = require('../env.json');
mongoose.connect(env.mongoUrl);

var User = require('../models/user');
var Garbage = require('../models/garbage');
var District = require('../models/district');

//used for districts.hbs
var RRule = require('rrule').RRule;
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
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
    District.find({
        name: district
    }).sort({
        "name": "1",
        "addresses.addressJP": "1"
    }).populate("garbages.garbage").exec(function(err, docs) {
        if (err) throw err;
        console.log(docs[0]);
        
        docs[0].garbages.forEach(function(garbage,index,array){
            console.log(garbage);
            var rruleObj = RRule.fromString(garbage.frequencyRRule);
            var nextDate = rruleObj.after(new Date(), true);
            console.log(nextDate);
            
            //save the next date
            array[index].nextDate = moment(nextDate).format("dddd, M/D/YY");
        });
        res.render('district', docs[0]);
    });
})

module.exports = router;
