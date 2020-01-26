var dataFolder = './dbdev/';
var garbagesData = dataFolder + 'garbages.csv';
var districtsData = dataFolder + 'districts.csv';

//npm install csv-parse
import parse from 'csv-parse/lib/sync';

import fs from 'fs';
import waterfall from 'async-waterfall';
import mongoose from 'mongoose';
//IF THERE ARE ISSUES--CHECK THIS LINE
require('../config/dotenv').getEnv();
mongoose.connect(process.env.MONGO_URL);

import Garbage from '../models/garbage';
import District from '../models/district';
import User from '../models/user';

var garbageTypes = [
  'burnables',
  'plasticcontainers',
  'plasticbottles',
  'cans',
  'foodandbeverage',
  'solidwaste',
  'ceramicglass',
  'newspaperads',
  'magazinesmisc',
  'cardboard',
];

var districtDemoAddressJP = '南草津一から五丁目';

var garbageDemoRRules = {
  burnables: 'FREQ=WEEKLY;BYDAY=MO,TH',
  plasticcontainers: 'FREQ=MONTHLY;BYDAY=TU;BYSETPOS=2,4,5',
  plasticbottles: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=4',
  cans: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=3',
  foodandbeverage: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2',
  solidwaste: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=2',
  ceramicglass: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=4',
  newspaperads: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=1',
  magazinesmisc: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=1',
  cardboard: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=3',
};

function makeRRule(frequencyString) {
  //convert frequency string to RRule
  var daysJPtoEN = {
    月: 'MO',
    火: 'TU',
    水: 'WE',
    木: 'TH',
    金: 'FR',
    土: 'SA',
    日: 'SU',
  };

  var digitR = /\d/;
  var daysofweekR = /[月火水木金土日]/;

  var isMonthly = digitR.test(frequencyString);
  var howOften = isMonthly ? 'monthly' : 'weekly';
  var days = frequencyString.split(/\s/);

  var rrule = '';

  if (howOften == 'weekly') {
    var daysEN = days.map(function(day) {
      return daysJPtoEN[day];
    });

    rrule = 'FREQ=WEEKLY;BYDAY=';
    rrule += daysEN.join(',');
  } else if (howOften == 'monthly') {
    //get day of week from first day in string
    var dayEN = daysJPtoEN[daysofweekR.exec(frequencyString)[0]];

    //figure out which week in a month
    var dayNumbers = days.map(function(day) {
      return digitR.exec(day)[0];
    });

    rrule = 'FREQ=MONTHLY;BYDAY=';
    rrule += dayEN + ';BYSETPOS=';
    rrule += dayNumbers.join(',');
  }

  return rrule;
}

function initGarbage(callback) {
  var file = fs.readFileSync(garbagesData, 'utf8');
  var records = parse(file, {
    columns: true,
  });
  console.log('Imported Garbage Data');

  Garbage.insertMany(records, function() {
    console.log('Inserted Garbage Data!');
    callback();
  });
}

function initDistrict(callback) {
  var file = fs.readFileSync(districtsData, 'utf8');
  var records = parse(file, {
    columns: true,
  });

  //first get list of unsorted districts
  var districts = records.map(function(x) {
    return x.name;
  });
  //remove duplicates
  districts = districts.filter(function(elem, pos) {
    return districts.indexOf(elem) == pos;
  });
  console.log(districts);

  districts = districts.map(function(districtName) {
    var relatedEntries = records.filter(function(y) {
      return y.name == districtName;
    });

    var x = relatedEntries[0]; //use values of first hit

    var r = {
      name: x.name,
      nameJP: x.nameJP,
      addresses: [],
      garbages: garbageTypes.map(function(i) {
        return {
          garbage: i,
          frequency: x[i],
          frequencyRRule: makeRRule(x[i]),
        };
      }),
    };

    r.addresses = relatedEntries.map(function(p) {
      return {
        addressJP: p.addressJP,
        address: p.address,
        zipcode: p.zipcode,
      };
    });

    return r;
  });

  console.log(districts);

  console.log('Imported District Data');

  District.insertMany(districts, function() {
    console.log('Inserted District Data!');
    callback();
  });
}

function initDemoDistrictData(callback) {
  //DEPRECATED
  District.findOne(
    {
      'addresses.addressJP': districtDemoAddressJP,
    },
    foundone
  );

  function foundone(err, docs) {
    if (err) throw err;

    docs.garbages.forEach(function(x) {
      x.frequencyRRule = garbageDemoRRules[x.garbage];
    });
    docs.save(function() {
      console.log('Demo data saved');
      callback();
    });
  }
}

function init() {
  waterfall([initGarbage, initDistrict], function() {
    console.log('Everything initialized');
    process.exit();
  });
}

//initGarbage();
//initDistrict();
//initDemoDistrictData();
//init();

if (!module.parent) {
  console.log('Initializing');
  init();
  //initDistrict();
} else {
  console.log("run 'init()' to initialize");
}

module.exports.initGarbage = initGarbage;
module.exports.initDistrict = initDistrict;
module.exports.initDemoDistrictData = initDemoDistrictData;
module.exports.init = init;
