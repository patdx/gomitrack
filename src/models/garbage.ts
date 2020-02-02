import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const garbageSchema = new Schema({
  _id: String,
  name: String,
  nameJP: String,
  disposal: String,
  disposalJP: String,
  calendarColor: String,
});

export const Garbage = mongoose.model('Garbage', garbageSchema);
