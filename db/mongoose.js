var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
console.log("Connecting to DB...");
mongoose.connect(process.env.MONGO_URL).then(
    () => {
        console.log("Connected to DB!")
    },
    err => {
        console.log("Error: Couldn't connect to DB!", err)
    }
);

module.exports = mongoose;
