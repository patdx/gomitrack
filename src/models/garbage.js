import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var garbageSchema = new Schema({
  _id: String,
  name: String,
  nameJP: String,
  disposal: String,
  disposalJP: String,
  calendarColor: String,
});

var Garbage = mongoose.model('Garbage', garbageSchema);
module.exports = Garbage;
