const moment = require('moment');

console.log(moment('8/25/2019', "MM-DD-YYYY").isSame(moment(), 'month'))