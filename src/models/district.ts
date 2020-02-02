import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { RRule } from 'rrule';
import moment from 'moment';

const garbageScheduleSchema = new Schema({
  garbage: {
    type: String,
    ref: 'Garbage',
  },
  frequency: String,
  frequencyRRule: String,
});

garbageScheduleSchema.virtual('nextDate').get(function(this: any) {
  const rruleObj = RRule.fromString(this.frequencyRRule);
  return rruleObj.after(new Date(), true);
});

garbageScheduleSchema.virtual('nextDateFormatted').get(function(this: any) {
  return moment(this.nextDate).format('dddd, M/D/YY');
});

const addressSchema = new Schema({
  address: String,
  addressJP: String,
  zipcode: String,
  lat: Number,
  lng: Number,
});

addressSchema.virtual('zipcodePretty').get(function(this: any) {
  //adds the dash "1550000" --> "155-0000"
  return this.zipcode.slice(0, 3) + '-' + this.zipcode.slice(3);
});

const districtSchema = new Schema({
  name: String,
  nameJP: String,
  addresses: [addressSchema],
  garbages: [garbageScheduleSchema],
});

districtSchema.virtual('mapLocations').get(function(this: any) {
  return this.addresses.map(function(p) {
    return {
      lat: p.lat,
      lng: p.lng,
    };
  });
});

export const justNames = () => {
  //used to populate navbar
  return District.find({})
    .select({
      _id: 0,
      name: 1,
      nameJP: 1,
    })
    .sort({
      name: '1',
    });
};

export const findDistrict = districtName => {
  return District.findOne({
    name: districtName,
  })
    .sort({
      'addresses.addressJP': '1',
    })
    .populate('garbages.garbage');
};

export const findDistrictWithSortedSchedule = districtName => {
  return findDistrict(districtName)
    .exec()
    .then((data?: any) => {
      if (!data) {
        return;
      }
      data.garbages.sort(function(a, b) {
        return a.nextDate - b.nextDate;
      });
      return data;
    });
};

export const District = mongoose.model('District', districtSchema);
