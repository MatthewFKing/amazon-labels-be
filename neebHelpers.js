exports.neConverter = (query, callback) => {
  var XLSX = require('xlsx');

  var workbook = XLSX.readFile('test.xls');
  let ws = workbook.Sheets['Order List'];
  callback(XLSX.utils.sheet_to_json(ws));
}

exports.ebOrderNumbers = (ebReport, callback) => {
  const csv = require('csvtojson')
  let data = ebReport.split("\r\n").map(line => {
    return line.split(/,/).map(text => {
      return text.replace(/"/g,"");
    });
  });
  // csv().fromString(ebReport, (err, result) => {
  //   if (err) console.log(err);
  //   console.log(result);
  // });

  let ebOrders = data.filter(line => {
    return line[10] === "United States";
  })
  callback(ebOrders.map(line => line[0]));

}