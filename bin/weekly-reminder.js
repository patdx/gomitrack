console.log("file:", __filename, "cwd:", process.cwd());
var dotenv = require('dotenv').config({
    path: __dirname + '/../.env'
});
console.log(dotenv);

var mongoose = require('../db/mongoose-load');
var User = require('../models/user');
var Garbage = require('../models/garbage');
var District = require('../models/district');

var hbs = require('hbs');

var fs = require('fs');

var request = require('request'); //used to connect to test server

var district = "Oikami A"; //temp name

//LINE Notify
//https://notify-bot.line.me/doc/en/
const LINENotifyURL = "https://notify-api.line.me/api/notify"

mongoose.connectionPromise.then(function() {
    console.log("Getting Schedule Info...");
    District.findDistrictWithSortedSchedule(district).then(function(data) {
        console.log("Got schedule info");

        var templateFile = fs.readFileSync("./views/weekly-reminder.hbs", "utf8");
        var template = hbs.compile(templateFile, {
            noEscape: true, //won't escape any special characters for html
            strict: true
        });

        console.log("Rendering template...");

        var result = template({
            data
        });
        console.log(result);

        //IFTTT Notify
        // {
        //     url: process.env.IFTT_NOTIFY_URL.
        //     method: "POST",
        //     json: true,
        //     body: {
        //         value1: result //use result text
        //     }
        // }

        request({
            url: LINENotifyURL,
            method: "POST",
            'auth': {
                'bearer': process.env.LINE_NOTIFY_TOKEN
            },
            form: {
                message: result //use result text
            }
        }, function(error, response, body) {
            console.log('error:', error); // Print the error if one occurred 
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
            console.log('body:', body); // Print the result
            process.exit();
        });

    });
});
