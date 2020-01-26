import mongoose from 'mongoose';
var Schema = mongoose.Schema;

import { RRule } from 'rrule';
import moment from 'moment';

var garbageScheduleSchema = new Schema({
  garbage: {
    type: String,
    ref: 'Garbage',
  },
  frequency: String,
  frequencyRRule: String,
});

garbageScheduleSchema.virtual('nextDate').get(function() {
  var rruleObj = RRule.fromString(this.frequencyRRule);
  return rruleObj.after(new Date(), true);
});

garbageScheduleSchema.virtual('nextDateFormatted').get(function() {
  return moment(this.nextDate).format('dddd, M/D/YY');
});

var addressSchema = new Schema({
  address: String,
  addressJP: String,
  zipcode: String,
  lat: Number,
  lng: Number,
});

addressSchema.virtual('zipcodePretty').get(function() {
  //adds the dash "1550000" --> "155-0000"
  return this.zipcode.slice(0, 3) + '-' + this.zipcode.slice(3);
});

var districtSchema = new Schema({
  name: String,
  nameJP: String,
  addresses: [addressSchema],
  garbages: [garbageScheduleSchema],
});

districtSchema.virtual('mapLocations').get(function() {
  return this.addresses.map(function(p) {
    return {
      lat: p.lat,
      lng: p.lng,
    };
  });
});

districtSchema.query.justNames = function() {
  //used to populate navbar
  return this.find({})
    .select({
      _id: 0,
      name: 1,
      nameJP: 1,
    })
    .sort({
      name: '1',
    });
};

districtSchema.query.findDistrict = function(districtName) {
  return District.findOne({
    name: districtName,
  })
    .sort({
      'addresses.addressJP': '1',
    })
    .populate('garbages.garbage');
};

districtSchema.statics.findDistrictWithSortedSchedule = function(districtName) {
  return this.find()
    .findDistrict(districtName)
    .exec()
    .then(function(data) {
      data.garbages.sort(function(a, b) {
        return a.nextDate - b.nextDate;
      });
      return data;
    });
};

var District = mongoose.model('District', districtSchema);

export default District;
