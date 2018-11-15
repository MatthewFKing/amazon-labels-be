var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1W3IeQTmiEpmt1_5V9nzJFrnUu5OE8T_1LeF7bGukizs');

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
    let wip = rows.filter(row => {
      return row.status !== "SENT"
    });

    let wipQty = wip.reduce((total, current) => {
      return total + Number(current.qty);
    }, 0);
    
    console.log(wipQty);
  });
});