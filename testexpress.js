var express = require("express");
var app = express();
//var bodyParser = require("bodyParser");

var port = process.env.PORT;

var mongoose = require('mongoose');
var env = require('./env.json');
mongoose.connect(env.mongoUrl);

var User = require('./models/user');
var Garbage = require('./models/garbage');
var District = require('./models/district');

console.log("setup");

app.get("/",function(req, res) {
    res.send('hello<a href="/garbage">garbage</a><a href="/district">district</a>');
});


app.get("/garbage",function(req,res) {
    Garbage.find({}, function(err, garbages) {
        if (err) throw err;
        res.send(garbages);
    });
    //res.send("hello hello hello");
    console.log("sent a response yeahhh");
});

app.get("/district",function(req,res) {
    District.find({}, function(err, docs) {
        if (err) throw err;
        res.send({district: docs});
    });
    //res.send("hello hello hello");
    console.log("sent a response yeahhh");
});

console.log("setup2");

app.listen(port, function() {
    console.log("app listening!! port" + port);
})