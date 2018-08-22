// var XLSX = require('xlsx');

// var workbook = XLSX.readFile('test.xls');
// let ws = workbook.Sheets['Order List'];
// console.log(XLSX.utils.sheet_to_json(ws));

// const partsExport = require('./part.json');
// let data = partsExport.find(part => {
//   return part.PartNumber === "LT-WIFI-045";
// })
// console.log(data['Tracks-Lot Number'])


const csvFilePath='./parttest.csv';
const csv=require('csvtojson')

csv().fromFile(csvFilePath,function(err,result){

    if(err){
        console.log("An Error Has Occured");
        console.log(err);  
    } 

    var json = result;
    var fs = require('fs');
    fs.writeFile ("input.json", JSON.stringify(json), function(err) {
      if (err) throw err;
      console.log('complete');
      }
  );
});

