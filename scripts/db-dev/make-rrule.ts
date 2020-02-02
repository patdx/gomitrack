const testInput = [
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

// const garbageDemoRRules = {
//   burnables: 'FREQ=WEEKLY;BYDAY=MO,TH',
//   plasticcontainers: 'FREQ=MONTHLY;BYDAY=TU;BYSETPOS=2,4,5',
//   plasticbottles: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=4',
//   cans: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=3',
//   foodandbeverage: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2',
//   solidwaste: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=2',
//   ceramicglass: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=4',
//   newspaperads: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=1',
//   magazinesmisc: 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=1',
//   cardboard: 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=3',
// };

function makeRRule(frequencyString) {
  const daysJPtoEN = {
    月: 'MO',
    火: 'TU',
    水: 'WE',
    木: 'TH',
    金: 'FR',
    土: 'SA',
    日: 'SU',
  };

  const digitR = /\d/;
  const daysofweekR = /[月火水木金土日]/;

  const isMonthly = digitR.test(frequencyString);
  const howOften = isMonthly ? 'monthly' : 'weekly';
  console.log(frequencyString, howOften);
  const days = frequencyString.split(/\s/);

  let rrule = '';

  if (howOften == 'weekly') {
    const daysEN = days.map(function(day) {
      return daysJPtoEN[day];
    });
    console.log(daysEN);

    rrule = 'FREQ=WEEKLY;BYDAY=';
    rrule += daysEN.join(',');
  } else if (howOften == 'monthly') {
    //get day of week from first day in string
    const dayJA = daysofweekR.exec(frequencyString)?.[0];
    if (!dayJA) {
      throw new Error('missing day in JA');
    }
    const dayEN = daysJPtoEN[dayJA];

    //figure out which week in a month
    const dayNumbers = days.map(function(day) {
      return digitR.exec(day)?.[0];
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
