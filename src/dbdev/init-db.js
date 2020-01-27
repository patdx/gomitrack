const dataFolder = './dbdev/';
const garbagesData = dataFolder + 'garbages.csv';
const districtsData = dataFolder + 'districts.csv';

import waterfall from 'async-waterfall';
import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import mongoose from 'mongoose';
import District from '../models/district';
import Garbage from '../models/garbage';
import { MONGO_URL } from '../config/env';

mongoose.connect(MONGO_URL);

const garbageTypes = [
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

const districtDemoAddressJP = '南草津一から五丁目';

const garbageDemoRRules = {
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
  const daysJPtoEN = {
    月: 'MO',
    火: 'TU',
    水: 'WE',
    木: 'TH',
    金: 'FR',
    土: 'SA',
    日: 'SU',
  };

  const digitR = /\d/;
  const daysofweekR = /[月火水木金土日]/;

  const isMonthly = digitR.test(frequencyString);
  const howOften = isMonthly ? 'monthly' : 'weekly';
  const days = frequencyString.split(/\s/);

  let rrule = '';

  if (howOften == 'weekly') {
    const daysEN = days.map(function(day) {
      return daysJPtoEN[day];
    });

    rrule = 'FREQ=WEEKLY;BYDAY=';
    rrule += daysEN.join(',');
  } else if (howOften == 'monthly') {
    //get day of week from first day in string
    const dayEN = daysJPtoEN[daysofweekR.exec(frequencyString)?.[0]];

    //figure out which week in a month
    const dayNumbers = days.map(function(day) {
      return digitR.exec(day)?.[0];
    });

    rrule = 'FREQ=MONTHLY;BYDAY=';
    rrule += dayEN + ';BYSETPOS=';
    rrule += dayNumbers.join(',');
  }

  return rrule;
}

function initGarbage(callback) {
  const file = fs.readFileSync(garbagesData, 'utf8');
  const records = parse(file, {
    columns: true,
  });
  console.log('Imported Garbage Data');

  Garbage.insertMany(records, function() {
    console.log('Inserted Garbage Data!');
    callback();
  });
}

function initDistrict(callback) {
  const file = fs.readFileSync(districtsData, 'utf8');
  const records = parse(file, {
    columns: true,
  });

  //first get list of unsorted districts
  let districts = records.map(function(x) {
    return x.name;
  });
  //remove duplicates
  districts = districts.filter(function(elem, pos) {
    return districts.indexOf(elem) == pos;
  });
  console.log(districts);

  districts = districts.map(function(districtName) {
    const relatedEntries = records.filter(function(y) {
      return y.name == districtName;
    });

    const x = relatedEntries[0]; //use values of first hit

    const r = {
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

export function initDemoDistrictData(callback) {
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

console.log('Initializing');
init();
