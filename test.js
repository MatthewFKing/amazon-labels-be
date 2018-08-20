// var XLSX = require('xlsx');

// var workbook = XLSX.readFile('test.xls');
// let ws = workbook.Sheets['Order List'];
// console.log(XLSX.utils.sheet_to_json(ws));

const partsExport = require('./part.json');
let data = partsExport.find(part => {
  return part.PartNumber === "LT-WIFI-045";
})
console.log(data['Tracks-Lot Number'])