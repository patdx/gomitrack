var dataFolder = './dbdev/'

var mongoose = require('mongoose');
mongoose.Promise = global.Promise //use native promises
require('../config/dotenv').getEnv()
mongoose.connect(process.env.MONGO_URL);

var Garbage = require('../models/garbage');
var District = require('../models/district');
var User = require('../models/user');

var googleMapsClient = require('@google/maps').createClient({
    key: process.env.MAPS_API,
    Promise: Promise
});

const util = require('util');

function logSuccess(data) {
    console.log("Promise Success!", util.inspect(data, {
        depth: null
    }));
}

function logFail(data) {
    console.log("Promise Fail!!", data);
}

function geocodeAddress(address) {
    //returns promise;
    return googleMapsClient.geocode({
        address: address
    }).asPromise();

    //It's not really clear how the Google API might return data so I think it's
    //good to test what happens with other strange results. For example:

    //return Promise.reject("bad data");
    //return Promise.accept("bad data");

    //returned data usually looks like this:
    // {
    //     status: 200,
    //     headers: { ... },
    //     json: {
    //         results: [Object],
    //         status: 'OK'
    //     }
    // }
}

function getLatLonforAddress(address) {
    //returns promise
    return geocodeAddress(address).then(function(data) {
        var location, lat, lng;

        try {
            location = data.json.results[0].geometry.location;
            lat = location.lat;
            lng = location.lng;
            return {
                lat: lat,
                lng: lng
            };
        }
        catch (err) {
            return Promise.reject({
                err: "Couldn't retrieve lat and lng data from Google.",
                retrievedData: data,
                errObject: err
            });
        }
    })
}

function geocodeDBAddresses(districts) {

    var districtsPromises = districts.map(function(district) {

        var addressesPromises = district.addresses.map(function(address, i) {
            var promise = getLatLonforAddress(address.zipcode);
            promise.then(logSuccess, logFail);
            promise.then(function(data) {
                //update mongoose districts object
                district.addresses[i].lat = data.lat;
                district.addresses[i].lng = data.lng;
            });

            return promise; //return so we can check when all promises are finished
        });

        var addressesPromisesAll = Promise.all(addressesPromises);
        addressesPromisesAll;

        addressesPromisesAll.then(function(data) {
            console.log("Saving " + district.name + "...");
            district.save().then(function(data) {
                console.log("Saved " + district.name + "!");
            }, logFail)
        })

        return addressesPromisesAll;
    });

    var districtsPromisesAll = Promise.all(districtsPromises);

    districtsPromisesAll.then(function(p) {
        console.log("Finished Everything");
        process.exit();
    }, function(reason) {
        console.log("LAST ERROR");
        console.log(reason);
        console.log("Couldn't finish everything.");
        process.exit();
    })


}

// var lookupPromise = District.find({
//     "addresses.lat": {
//         $exists: false
//     }
// }).exec();

var lookupPromise = District.find({}).exec();

lookupPromise.then(geocodeDBAddresses, logFail);
