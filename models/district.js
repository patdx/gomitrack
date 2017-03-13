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

districtSchema.query.justNames = function() {
    //used to populate navbar
    return this.find({}).select({
        _id: 0,
        name: 1,
        nameJP: 1
    }).sort({
        "name": "1"
    });
};

var District = mongoose.model('District', districtSchema);

module.exports = District;
