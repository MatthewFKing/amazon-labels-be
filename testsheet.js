const moment = require('moment');
console.log(moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month'));