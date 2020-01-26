import mongoose from 'mongoose';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

console.log('Connecting to DB...');
const connectionPromise = mongoose.connect(process.env.MONGO_URL);
connectionPromise.then(
  () => {
    console.log('Connected to DB!');
  },
  err => {
    console.log("Error: Couldn't connect to DB!", err);
  }
);

export { mongoose, connectionPromise };
