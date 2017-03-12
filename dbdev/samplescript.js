var dataFolder = './dbdev/'

var mongoose = require('mongoose');
var env = require('../env.json');
mongoose.connect(env.mongoUrl);

var Garbage = require('../models/garbage');
var District = require('../models/district');
var User = require('../models/user');

function initDemoDistrictData(callback) {
    District.find({
        addresses: {
            $exists: true
        }
    }, found);

    function found(err, docs) {
        if (err) throw err;
        
        console.log("found");
        
        process.exit();

        /*docs.save(function() {
            console.log("Demo data saved");
            callback();
        });*/
    }
}

initDemoDistrictData();