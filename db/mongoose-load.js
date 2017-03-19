var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
console.log("Connecting to DB...");
var connectionPromise = mongoose.connect(process.env.MONGO_URL);
connectionPromise.then(
    () => {
        console.log("Connected to DB!")
    },
    err => {
        console.log("Error: Couldn't connect to DB!", err)
    }
);

module.exports = {
    mongoose,
    connectionPromise
};
