var mongoose = require('mongoose');
var env = require('./env.json');
mongoose.connect(env.mongoUrl);

var User = require('./models/user');
var Garbage = require('./models/garbage');
var District = require('./models/district');

mongoose.connection.once('open', function() {
    var myGarbage = new Garbage({
        name: "poop",
        information: "double poop",
        picture: "poop3"
    });
    myGarbage.save(function(err) {
        if (err) throw err;
        console.log('saved garbage');

        Garbage.find({}, function(err, garbages) {
            if (err) throw err;
            console.log(garbages);
            process.exit();
        });
    });

})
