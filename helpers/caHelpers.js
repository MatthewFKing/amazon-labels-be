const headers = require('./headers.js').so;
const moment = require('moment');

const neCaConverter = exports.neCaConverter = (data, callback) => {
  var XLSX = require('xlsx');
  const fs = require('fs');
  const timeStamp = data.timeStamp;

  var workbook = XLSX.readFile(`./reporttmp/${timeStamp}CA.xls`);
  let ws = workbook.Sheets['Order List'];
  let neReport = XLSX.utils.sheet_to_json(ws);

  let orderIDs = neReport.map(line => {
    return line['Order Number'];
  });

  fs.unlink(`./reporttmp/${timeStamp}CA.xls`, (err) => {
    if (err) throw err;
  });

  callback({ orderIDs, neReport });
}

const generate = exports.generate = (data, callback) => {

  let neReport = data.neReport;
  let eWasteFees = data.eWasteFees.map(id => {
    id.amount = parseFloat(id.amount).toFixed(2);
    return id;
  });

  let fbReport = [];
  let currentOrders = [];
  fbReport.push(headers.header1.split(','));
  fbReport.push(headers.header2.split(','));

  neReport.forEach(order => {

    currentOrders.push(order['Order Number']);
    let eWasteFee = eWasteFees.find(id => {
      return id.id === order['Order Number'];
    }).amount;


    let gstFee = (parseFloat(order['Order Total'].replace(',', '')) - parseFloat(order['Order Shipping Total']) - parseFloat(order['Item Unit Price'].replace(',', ''))).toFixed(2);

    ////////////////////////////////////
    // PO Line
    let soLine = headers.line.split(',');

    soLine[3] = order['Ship To Name'];
    soLine[4] = order['Ship To Name'];
    soLine[5] = order['Ship To Name'];
    soLine[6] = `${order['Ship To Address Line 1']}\n${order['Ship To Address Line 2']}`;
    soLine[7] = order['Ship To City'];
    soLine[8] = order['Ship To State'];
    soLine[9] = order['Ship To Zipcode'];
    soLine[10] = order['Ship to Country'];
    soLine[11] = order['Ship To Name'];
    soLine[12] = `${order['Ship To Address Line 1']}\n${order['Ship To Address Line 2']}`;
    soLine[13] = order['Ship To City'];
    soLine[14] = order['Ship To State'];
    soLine[15] = order['Ship To Zipcode'];
    soLine[16] = order['Ship to Country'];
    soLine[20] = order['Order Number'];
    soLine[22] = order['Order Date & Time'];
    soLine[25] = "NEWEGG Payments";
    soLine[30] = order['Auto Void Date & Time'];
    soLine[34] = order['Ship To Phone Number'];
    soLine[35] = order['Order Customer Email'];
    soLine[36] = order['Auto Void Date & Time'];
    soLine[32] = "Worldwide Expedited"

    fbReport.push(soLine);

    ////////////////////////////////////
    // Item Line
    let itemLine = headers.item.split(',');

    itemLine[2] = order['Item Seller Part #'];
    itemLine[4] = order['Item Quantity Ordered'];
    itemLine[6] = order['Item Unit Price'];
    itemLine[9] = order['Item Newegg #'];
    itemLine[11] = order['Auto Void Date & Time'];

    fbReport.push(itemLine);

    ////////////////////////////////////
    // GST Line
    let gstLine = headers.gst.split(',');

    gstLine[6] = gstFee;
    gstLine[11] = order['Auto Void Date & Time'];

    fbReport.push(gstLine);

    ////////////////////////////////////
    // E-Waste Line
    if (eWasteFee > 0) {

      let eWasteLine = headers.eWaste.split(',');

      eWasteLine[6] = eWasteFee;
      eWasteLine[11] = order['Auto Void Date & Time'];

      fbReport.push(eWasteLine);
    }

    ////////////////////////////////////
    // Shipping Line
    let shipLine = headers.shipping.split(',');

    shipLine[6] = order['Order Shipping Total'];
    shipLine[11] = order['Auto Void Date & Time'];

    fbReport.push(shipLine);

  });

  callback(fbReport);
}

const amzGenerate = exports.amzGenerate = (data, callback) => {
  let clearedOrders = data.clearedOrders;
  let allOrders = data.caAllOrders;
  let unshippedOrders = data.caUnshippedOrders;

  let fbReport = [];
  fbReport.push(headers.header1.split(','));
  fbReport.push(headers.header2.split(','));

  clearedOrders.forEach(order => {
    let allReport = allOrders.find(id => id[0] === order);
    let unshippedReport = unshippedOrders.find(id => id[0] === order);

    let soLine = headers.line.split(',');

    soLine[3] = unshippedReport[19];
    soLine[4] = unshippedReport[19];
    soLine[5] = unshippedReport[19];
    soLine[6] = `${unshippedReport[20]}\n${unshippedReport[21]}`;
    soLine[7] = unshippedReport[24];
    soLine[8] = unshippedReport[25];
    soLine[9] = unshippedReport[26];
    soLine[10] = unshippedReport[27];
    soLine[11] = unshippedReport[19];
    soLine[12] = `${unshippedReport[20]}\n${unshippedReport[21]}`;
    soLine[13] = unshippedReport[24];
    soLine[14] = unshippedReport[25];
    soLine[15] = unshippedReport[26];
    soLine[16] = unshippedReport[27];
    soLine[20] = unshippedReport[0];
    soLine[22] = moment(unshippedReport[2]).format('L');
    soLine[25] = "Amazon.com - FBM";
    soLine[30] = moment(unshippedReport[5]).format('L');
    soLine[34] = unshippedReport[10];
    soLine[35] = unshippedReport[7];
    soLine[36] = moment(unshippedReport[5]).format('L');
    soLine[32] = "Worldwide Expedited"

    fbReport.push(soLine);

    let itemLine = headers.item.split(',');

    itemLine[2] = unshippedReport[11];
    itemLine[4] = unshippedReport[14];
    itemLine[6] = allReport[19];
    itemLine[9] = allReport[12];
    itemLine[11] = moment(unshippedReport[5]).format('L');

    fbReport.push(itemLine);

    let shipLine = headers.shipping.split(',');

    shipLine[6] = allReport[21];
    shipLine[11] = moment(unshippedReport[5]).format('L');

    fbReport.push(shipLine);

    let gstLine = headers.gst.split(',');

    gstLine[6] = (parseFloat(allReport[20]) + parseFloat(allReport[22])).toFixed(2);
    gstLine[11] = moment(unshippedReport[5]).format('L');

    fbReport.push(gstLine);

  });

  callback(fbReport);
  
}