import mongoose from 'mongoose';
import util from 'util';
import {District} from '../../src/models/district';
import { MONGO_URL } from '../../src/config/env';

mongoose.connect(MONGO_URL);

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.MAPS_API,
  Promise: Promise,
});

function logSuccess(data) {
  console.log(
    'Promise Success!',
    util.inspect(data, {
      depth: null,
    })
  );
}

function logFail(data) {
  console.log('Promise Fail!!', data);
}

function geocodeAddress(address) {
  //returns promise;
  return googleMapsClient
    .geocode({
      address: address,
    })
    .asPromise();

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
    let location, lat, lng;

    try {
      location = data.json.results[0].geometry.location;
      lat = location.lat;
      lng = location.lng;
      return {
        lat: lat,
        lng: lng,
      };
    } catch (err) {
      return Promise.reject({
        err: "Couldn't retrieve lat and lng data from Google.",
        retrievedData: data,
        errObject: err,
      });
    }
  });
}

function geocodeDBAddresses(districts) {
  const districtsPromises = districts.map(function(district) {
    const addressesPromises = district.addresses.map(function(address, i) {
      const promise = getLatLonforAddress(address.zipcode);
      promise.then(logSuccess, logFail);
      promise.then(function(data) {
        //update mongoose districts object
        district.addresses[i].lat = data.lat;
        district.addresses[i].lng = data.lng;
      });

      return promise; //return so we can check when all promises are finished
    });

    const addressesPromisesAll = Promise.all(addressesPromises);
    addressesPromisesAll;

    addressesPromisesAll.then(function() {
      console.log('Saving ' + district.name + '...');
      district.save().then(function() {
        console.log('Saved ' + district.name + '!');
      }, logFail);
    });

    return addressesPromisesAll;
  });

  const districtsPromisesAll = Promise.all(districtsPromises);

  districtsPromisesAll.then(
    function() {
      console.log('Finished Everything');
      process.exit();
    },
    function(reason) {
      console.log('LAST ERROR');
      console.log(reason);
      console.log("Couldn't finish everything.");
      process.exit();
    }
  );
}

const lookupPromise = District.find({}).exec();

lookupPromise.then(geocodeDBAddresses, logFail);
