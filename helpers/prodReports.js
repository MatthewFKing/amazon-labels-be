//list of working days
const moment = require('moment');
const qaEntry = require('../models/QAEntry');


exports.workingDays = (data, callback) => {
  let dates = data.map(entry => {
    return entry.date;
  });

  let uniqueDates = dates.filter((date, i, self) =>
    self.findIndex(d => d.getTime() === date.getTime()) === i
  )

  uniqueDates.sort((a, b) => a.getTime() - b.getTime());




  //Daily Point Totals
  let dailyPoints = [];
  uniqueDates.forEach((date, i) => {
    let pointTotal = data.filter(entry => entry.date.getTime() === date.getTime()).reduce((total, line) => {
      if (!isNaN(parseInt(line.points_value, 10))) {
        return total + parseInt(line.points_value, 10);
      } else {
        return total + 0;
      }
    }, 0);
    dailyPoints.push([date, pointTotal]);
  });

  let weeks = uniqueDates.filter((date, i, self) =>
    self.findIndex(d => moment(d).week() === moment(date).week()) === i
  ).map(day => moment(day).week());


  

  weeks.sort((a,b) => a - b);

  weeks.forEach((week, i) => {
    let points = dailyPoints.filter(entry => moment(entry[0]).week() === week).reduce((total, day) => {
        return total + parseInt(day[1], 10);
    }, 0);
    weeks.push([points, week])
  });

  


  
  


  console.log(weeks);
  callback(dailyPoints);
}


//points per
  //tech
    //month
    //week
    //day
  //total
    //month
    //week
    //day
//% FBA vs Prod
