console.log('file:', __filename, 'cwd:', process.cwd());
require('../config/dotenv').getEnv();

import mongoose from '../db/mongoose-load';
import User from '../models/user';
import Garbage from '../models/garbage';
import District from '../models/district';
import hbs from 'hbs';
import fs from 'fs';
import request from 'request'; //used to connect to test server

let district = 'Oikami A'; //temp name

//LINE Notify
//https://notify-bot.line.me/doc/en/
const LINENotifyURL = 'https://notify-api.line.me/api/notify';

mongoose.connectionPromise.then(function() {
  console.log('Getting Schedule Info...');
  District.findDistrictWithSortedSchedule(district).then(function(data) {
    console.log('Got schedule info');

    let templateFile = fs.readFileSync('./views/weekly-reminder.hbs', 'utf8');
    let template = hbs.compile(templateFile, {
      noEscape: true, //won't escape any special characters for html
      strict: true,
    });

    console.log('Rendering template...');

    let result = template({
      data,
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

    request(
      {
        url: LINENotifyURL,
        method: 'POST',
        auth: {
          bearer: process.env.LINE_NOTIFY_TOKEN,
        },
        form: {
          message: result, //use result text
        },
      },
      function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the result
        process.exit();
      }
    );
  });
});
