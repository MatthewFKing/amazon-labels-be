exports.fnSku = (data, callback) => {
  var GoogleSpreadsheet = require('google-spreadsheet');
  var creds = require('../client_secret.json');

  var doc = new GoogleSpreadsheet('1W3IeQTmiEpmt1_5V9nzJFrnUu5OE8T_1LeF7bGukizs');

  doc.useServiceAccountAuth(creds, function (err) {

    doc.getRows(1, function (err, rows) {
      doc.getRows(2, function (err, skuRows) {
        let workOrders = data.map(woNum => {
          let foundWO = rows.find(row => {
            return row.fbaworkorder === woNum;
          });
          return {
            woNum: foundWO.fbaworkorder,
            asin: foundWO.asinid,
            fnsku: foundWO.fnsku,
            qty: foundWO.qty
          }
        });
        let labelData = workOrders.map(wo => {
          let foundSku = skuRows.find(sku => {
            return sku.fnsku === wo.fnsku;
          });
          return { ...wo, ...{ sku: foundSku.sku, desc: foundSku.description } }
        });
        callback(labelData);
      });
    });
  });
};