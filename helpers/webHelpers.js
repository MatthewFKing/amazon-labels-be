const headers = require('./headers.js').so;
const fs = require('fs');
const moment = require('moment');
const today = moment().format('L');

const create = exports.create = (data, callback) => {
  let selectedOrders = data.selectedOrders;
  let report = data.report;
  let fbReport = [];

  fbReport.push(headers.header1.split(','));
  fbReport.push(headers.header2.split(','));

  for (let i = 0; i < report.length; i++) {
    if (selectedOrders.indexOf(report[i][0]) > -1) {

      //////////////////////////////////////////
      //// PO Line

      let soLine = headers.line.split(',');

      soLine[3] = report[i][2]; // Customer Name
      soLine[4] = report[i][2]; // Customer Name
      soLine[5] = report[i][2]; // Customer Name
      soLine[6] = report[i][15]; // Street Address
      soLine[7] = report[i][11]; // City
      soLine[8] = report[i][14]; // State
      soLine[9] = report[i][13]; // Zip
      soLine[10] = report[i][12]; // Country
      soLine[11] = report[i][2]; // Customer Name
      soLine[12] = report[i][15]; // Street Address
      soLine[13] = report[i][11]; // City
      soLine[14] = report[i][14]; // State
      soLine[15] = report[i][13]; // Zip
      soLine[16] = report[i][12]; // Country      
      soLine[20] = report[i][0]; // Magento Order ID
      soLine[22] = today; // Date
      soLine[25] = "Paypal Balance";
      soLine[30] = today; // Date
      soLine[36] = today;
      soLine[32] = "Ground"; //Shipping Method

      fbReport.push(soLine);

      //Tax information
      if (parseInt(report[i][8].substring(1)) > 0) {
        let taxLine = headers.tax.split(',');
        taxLine[6] = report[i][8];
        fbReport.push(taxLine);
      }

      //////////////////////////////////////////
      //// Item Line

      let itemLine = headers.item.split(',');
      let itemSku = report[i][1].split(',');

      itemLine[0] = "Item";
      itemLine[1] = "10";
      itemLine[2] = itemSku[0]; // Product SKU
      itemLine[4] = report[i][4]; // Qty
      itemLine[5] = "ea";
      itemLine[6] = report[i][19]; // Sale Price
      itemLine[9] = report[i][2]; //Sales Order Note
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
      shipLine[6] = report[i][7]; // Shipping Cost
      shipLine[10] = "None";
      shipLine[11] = today;
      shipLine[12] = "True";
      shipLine[13] = "FALSE";

      fbReport.push(shipLine);
    }
  }
  callback(fbReport);
}