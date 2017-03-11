var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var districtSchema = new Schema({
    name: String,
    nameJP: String,
    addresses: [{
        address: String,
        addressJP: String,
        zipcode: String,
        lat: Number,
        lng: Number
    }],
    garbages: [{
        garbage: {
            type: String,
            ref: 'Garbage'
        },
        frequency: String,
        frequencyRRule: String,
    }],
});

var District = mongoose.model('District', districtSchema);
module.exports = District;
