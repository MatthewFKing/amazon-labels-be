var XLSX = require('xlsx');

var workbook = XLSX.readFile('test.xls');
let ws = workbook.Sheets['Order List'];
console.log(XLSX.utils.sheet_to_json(ws));