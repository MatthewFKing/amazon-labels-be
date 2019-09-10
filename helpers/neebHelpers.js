const headers = require('./headers.js').so;
const fs = require('fs');
const moment = require('moment');
const today = moment().format('L');

const neConverter = exports.neConverter = (data, callback) => {
  var XLSX = require('xlsx');
  
  const timeStamp = data.timeStamp;
  const completedOrders = data.orderList;

  

  var workbook = XLSX.readFile(`./reporttmp/${timeStamp}.xls`);
  let ws = workbook.Sheets['Order List'];
  let neReport = XLSX.utils.sheet_to_json(ws);

  let fbReport = [];
  fbReport.push(headers.header1.split(','));
  fbReport.push(headers.header2.split(','));

  let currentOrders = [];

  neReport.forEach(order => {
    if (completedOrders.indexOf(order['Order Number']) === -1) {

      currentOrders.push(order['Order Number']);

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
      // Shipping Line
      let shipLine = headers.shipping.split(',');

      shipLine[6] = order['Order Shipping Total'];
      shipLine[11] = order['Auto Void Date & Time'];

      fbReport.push(shipLine);

    }
  });

  fs.unlink(`./reporttmp/${timeStamp}.xls`, (err) => {
    if (err) throw err;
  });

  const returnData = {
    fbReport,
    currentOrders
  }
  callback(returnData);
}

exports.ebOrderNumbers = (ebReport, callback) => {
  const csv = require('csvtojson');
  let data = ebReport.split("\r\n").map(line => {
    return line.split(/,/).map(text => {
      return text.replace(/"/g, "");
    });
  });

  let ebOrders = data.filter(line => {
    return line[10] === "United States";
  })
  callback(ebOrders.map(line => line[0]));

}


const ebConverter = exports.ebConverter = (data, callback) => {
  let clearedOrders = data.clearedOrders;
  let ebReport = data.report;
  let fbReport = [];

  fbReport.push(headers.header1.split(','));
  fbReport.push(headers.header2.split(','));

  for (let i = 0; i < ebReport.length; i++) {
    if (clearedOrders.indexOf(ebReport[i][0]) > -1) {

      //////////////////////////////////////////
      //// PO Line

      let soLine = headers.line.split(',');

      soLine[3] = ebReport[i][3]; // Customer Name
      soLine[4] = ebReport[i][3]; // Customer Name
      soLine[5] = ebReport[i][3]; // Customer Name
      soLine[6] = `${ebReport[i][6]} ${ebReport[i][7]}`; // Street Address
      soLine[7] = ebReport[i][8]; // City
      soLine[8] = ebReport[i][9]; // State
      soLine[9] = ebReport[i][10]; // Zip
      soLine[10] = ebReport[i][11]; // Country
      soLine[11] = ebReport[i][3]; // Customer Name
      soLine[12] = `${ebReport[i][6]} ${ebReport[i][7]}`; // Street Address
      soLine[13] = ebReport[i][8]; // City
      soLine[14] = ebReport[i][9]; // State
      soLine[15] = ebReport[i][10]; // Zip
      soLine[16] = ebReport[i][11]; // Country

      //Tax
      

      soLine[20] = ebReport[i][0]; // Ebay Order ID
      soLine[22] = today; // Date
      soLine[25] = "Paypal Balance";
      soLine[30] = today; // Date
      soLine[34] = ebReport[i][13]; // Phone
      soLine[35] = ebReport[i][4]; // Email 
      soLine[36] = today;

      if (ebReport[i][41] === "UPS Ground") {
        soLine[32] = "Ground"
      } else if (ebReport[i][41] === "Expedited Shipping (3-5 business days)") {
        soLine[32] = "3 Day Select"
      } else if (ebReport[i][41] === "UPS 2nd Day Air") {
        soLine[32] = "2nd Day Air"
      } else if (ebReport[i][41] === "One-Day Shipping(Next day)") {
        soLine[32] = "Next Day Air Saver"
      } else {
        soLine[32] = "Ground"
      }

      fbReport.push(soLine);

      if (parseInt(ebReport[i][27].substring(1)) > 0) {
        let taxLine = headers.tax.split(',');
        taxLine[6] = ebReport[i][27];
        fbReport.push(taxLine);
      }

      //////////////////////////////////////////
      //// Item Line

      let itemLine = headers.item.split(',');

      itemLine[0] = "Item";
      itemLine[1] = "10";
      itemLine[2] = ebReport[i][22]; // Product SKU
      itemLine[4] = ebReport[i][24]; // Qty
      itemLine[5] = "ea";
      itemLine[6] = ebReport[i][25]; // Sale Price


      itemLine[9] = ebReport[i][20];
      itemLine[10] = "None";
      itemLine[11] = today;
      itemLine[12] = "True";
      itemLine[13] = "FALSE";

      fbReport.push(itemLine);

      //////////////////////////////////////////
      //// Shipping Line

      let shipLine = headers.shipping.split(',');

      shipLine[0] = "Item";
      shipLine[1] = "60";
      shipLine[2] = "SHIPPING";
      shipLine[3] = "Shipping Fees";
      shipLine[4] = "1";
      shipLine[5] = "ea";
      shipLine[6] = ebReport[i][26]; // Shipping Cost

      shipLine[10] = "None";
      shipLine[11] = today;
      shipLine[12] = "True";
      shipLine[13] = "FALSE";

      fbReport.push(shipLine);

    }
  }

  callback(fbReport);
}


exports.neebConverter = (data, callback) => {

  //convert ebData back to arrays.

  const ebReportLine = data.ebData.ebReport.split(',');
  const ebReport = [];
  let chunk = 40;
  for (let i = 0; i < ebReportLine.length; i += chunk) {
    ebReport.push(ebReportLine.slice(i, i + chunk));
  }
  const ebData = { report: ebReport, clearedOrders: data.ebData.clearedOrders.split(',') };

  const neData = data.neData;
  
  //callback(ebReport);

  neConverter(neData, (neReturn) => {
    ebConverter(ebData, (ebReturn) => {
      const fullReport = [...ebReturn, ...neReturn.fbReport.splice(2, neReturn.fbReport.length - 1)];
      callback({
        fbReport: fullReport,
        currentOrders: neReturn.currentOrders
      });
    });
  });

}