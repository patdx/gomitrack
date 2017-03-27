var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  district: {
    type: Schema.Types.ObjectId,
    ref: 'District'
  },
  langPreference: String //'en' | 'jp'
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


var User = mongoose.model('User', userSchema);
module.exports = User;
