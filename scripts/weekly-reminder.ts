import fs from 'fs';
import hbs from 'hbs';
import request from 'request'; //used to connect to test server
import { findDistrictWithSortedSchedule } from '../src/models/district';

const district = 'Oikami A'; //temp name

//LINE Notify
//https://notify-bot.line.me/doc/en/
const LINENotifyURL = 'https://notify-api.line.me/api/notify';

function main() {
  console.log('Getting Schedule Info...');
  findDistrictWithSortedSchedule(district).then(function(data) {
    console.log('Got schedule info');

    const templateFile = fs.readFileSync('./views/weekly-reminder.hbs', 'utf8');
    const template = hbs.compile(templateFile, {
      noEscape: true, //won't escape any special characters for html
      strict: true,
    });

    console.log('Rendering template...');

    const result = template({
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
}

main();
