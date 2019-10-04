//list of working days
const moment = require('moment');
const qaEntry = require('../models/QAEntry');

dateList = (data) => {
  let dates = data.map(entry => {
    return entry.date;
  });

  let uniqueDays = dates.filter((date, i, self) =>
    self.findIndex(d => d.getTime() === date.getTime()) === i
  )

  uniqueDays.sort((a, b) => a.getTime() - b.getTime());

  let uniqueWeeks = uniqueDays.filter((date, i, self) =>
    self.findIndex(d => moment(d).week() === moment(date).week()) === i
  ).map(day => moment(day).week());

  uniqueWeeks.sort((a,b) => a - b);

  return {days: uniqueDays, weeks: uniqueWeeks};
}


workingDays = (data) => {
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

  //Weekly Points
  let weeklyPoints = uniqueDates.filter((date, i, self) =>
    self.findIndex(d => moment(d).week() === moment(date).week()) === i
  ).map(day => moment(day).week());

  weeklyPoints.sort((a,b) => a - b);

  let weeklyPointsTotal = [];
  weeklyPoints.forEach((week, i) => {
    let points = dailyPoints.filter(entry => moment(entry[0]).week() === week).reduce((total, day) => {
        return total + parseInt(day[1], 10);
    }, 0);
    weeklyPointsTotal.push([points, week])
  });

  //console.log(weeklyPoints);
  return({ dailyPoints, weeklyPointsTotal });
}

exports.techReport = async (techEntries, callback) => {
  let dataList = await qaEntry.find({tech_number: '13341839'});
  let report = workingDays(dataList);
  let bestDay = report.dailyPoints.reduce((current, next, i) => {
    return (next[1] > current) ? i : current;
  },0)

  let totalPoints = report.dailyPoints.reduce((a, b) => {
    return a+b[1];
  }, 0);

  let totalDaysWorked = report.dailyPoints.filter(a => {
    return a[1] > 5
  });
  

  const techReport = {
    bestDay,
    totalPoints,
    daysWorked: totalDaysWorked.length,
    prodNumbers: report

  }
  //console.log()
  callback(unitTotal(dataList));
}

unitTotal = (data) => {
  let uniqueDates = dateList(data);

  let unitTotal = data.filter((entry) => {
    return entry.sku.indexOf('LT') > -1 || entry.sku.indexOf('DT') > -1
  });

  let dailyTotal = []

  uniqueDates.days.forEach((date, i) => {
    let dayTotal = unitTotal.filter(entry => entry.date.getTime() === date.getTime()).reduce((total, line) => {
        return total + 1;
    }, 0);
    dailyTotal.push([date, dayTotal]);
  });

  let weeklyTotal = [];
  uniqueDates.weeks.forEach((week, i) => {
    let points = dailyTotal.filter(entry => moment(entry[0]).week() === week).reduce((total, day) => {
        return total + parseInt(day[1], 10);
    }, 0);
    weeklyTotal.push([points, week])
  });

  return {dailyTotal, weeklyTotal};
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
