import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let garbageSchema = new Schema({
  _id: String,
  name: String,
  nameJP: String,
  disposal: String,
  disposalJP: String,
  calendarColor: String,
});

let Garbage = mongoose.model('Garbage', garbageSchema);
export default Garbage;
