const headers = require('./headers.js').so;

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

    ////////////////////////////////////
    // Shipping Method
    if (order['Order Shipping Method'] === "Standard Shipping (5-7 business days)") {
      soLine[32] = "Ground"
    } else if (order['Order Shipping Method'] === "Expedited Shipping (3-5 business days)") {
      soLine[32] = "3 Day Select"
    } else if (order['Order Shipping Method'] === "Two-Day Shipping(2 business days)") {
      soLine[32] = "2nd Day Air"
    } else if (order['Order Shipping Method'] === "One-Day Shipping(Next day)") {
      soLine[32] = "Next Day Air Saver"
    } else {
      soLine[32] = "N/A"
    }

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