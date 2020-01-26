var testInput = [
  '月 木',
  '火2 火4 火5',
  '金4',
  '金3',
  '金2',
  '水2',
  '水4',
  '水1',
  '金1',
  '水3',
];

var garbageDemoRRules = {
  burnables: 'FREQ=WEEKLY;BYDAY=MO,TH',
  plasticcontainers: 'FREQ=MONTHLY;BYDAY=TU;BYSETPOS=2,4,5',
  plasticbottles: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=4',
  cans: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=3',
  foodandbeverage: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2',
  solidwaste: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=2',
  ceramicglass: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=4',
  newspaperads: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=1',
  magazinesmisc: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=1',
  cardboard: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=3',
};

function makeRRule(frequencyString) {
  var daysJPtoEN = {
    月: 'MO',
    火: 'TU',
    水: 'WE',
    木: 'TH',
    金: 'FR',
    土: 'SA',
    日: 'SU',
  };

  var digitR = /\d/;
  var daysofweekR = /[月火水木金土日]/;

  var isMonthly = digitR.test(frequencyString);
  var howOften = isMonthly ? 'monthly' : 'weekly';
  console.log(frequencyString, howOften);
  var days = frequencyString.split(/\s/);

  var rrule = '';

  if (howOften == 'weekly') {
    var daysEN = days.map(function(day) {
      return daysJPtoEN[day];
    });
    console.log(daysEN);

    rrule = 'FREQ=WEEKLY;BYDAY=';
    rrule += daysEN.join(',');
  } else if (howOften == 'monthly') {
    //get day of week from first day in string
    var dayEN = daysJPtoEN[daysofweekR.exec(frequencyString)[0]];

    //figure out which week in a month
    var dayNumbers = days.map(function(day) {
      return digitR.exec(day)[0];
    });
    console.log(dayEN, dayNumbers);

    rrule = 'FREQ=MONTHLY;BYDAY=';
    rrule += dayEN + ';BYSETPOS=';
    rrule += dayNumbers.join(',');
  }

  console.log(rrule);
  return rrule;
}

console.log(testInput.map(makeRRule));
