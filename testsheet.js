const moment = require('moment');
console.log(moment(moment().subtract(1, 'week')).startOf('week').format('L'));