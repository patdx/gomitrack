import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  district: {
    type: Schema.Types.ObjectId,
    ref: 'District',
  },
  langPreference: String, //'en' | 'jp'
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export const User = mongoose.model('User', userSchema);
