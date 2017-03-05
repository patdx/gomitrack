var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  password: String,
  district: {
    type: Schema.Types.ObjectId,
    ref: 'District'
  },
  langPreference: String //'en' | 'jp'
});

var User = mongoose.model('User', userSchema);
module.exports = User;
