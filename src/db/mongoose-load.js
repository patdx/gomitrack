import mongoose from 'mongoose';
import { MONGO_URL } from '../config/env';
import { memoize } from 'lodash';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

console.log('Connecting to DB...');

export const getOrInitMongoose = memoize(() => {
  const connectionPromise = mongoose.connect(MONGO_URL);
  connectionPromise.then(
    () => {
      console.log('Connected to DB!');
    },
    err => {
      console.log("Error: Couldn't connect to DB!", err);
    }
  );
  return connectionPromise;
});
