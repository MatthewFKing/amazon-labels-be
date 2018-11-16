exports.fnSku = (data, callback) => {
  var GoogleSpreadsheet = require('google-spreadsheet');
  var creds = require('../client_secret.json');

  var doc = new GoogleSpreadsheet('1W3IeQTmiEpmt1_5V9nzJFrnUu5OE8T_1LeF7bGukizs');

  doc.useServiceAccountAuth(creds, function (err) {

    doc.getRows(1, function (err, rows) {
      doc.getRows(3, function (err, skuRows) {
        let status = 'complete';
        let message = [];
        let workOrders = data.map(woNum => {
          let foundWO = rows.find(row => {
            return row.fbaworkorder === woNum;
          });
          if (!foundWO) {
            status = 'missing';
            message.push(`${woNum} was not found on the FBA Tracker`);
          } else if (foundWO.asinid === "" || foundWO.fnsku === "" || foundWO.qty === "") {
            status = 'missing';
            message.push(`${woNum} is missing information on the FBA Tracker`);

          } else if (foundWO) {
            return {
              woNum: foundWO.fbaworkorder,
              asin: foundWO.asinid,
              fnsku: foundWO.fnsku,
              qty: foundWO.qty
            }
          }
        });

        if (status === 'missing') {
          return callback({ status, message });
        }
        let labelData = workOrders.map(wo => {
          let foundSku = skuRows.find(sku => {
            return sku.fnsku === wo.fnsku;
          });
          if (foundSku) {
            return { ...wo, ...{ sku: foundSku.sku, desc: foundSku.description } }
          } else {
            status = 'missing';
            message.push(`Add SKU data for ${wo.fnsku}`)
            return { ...wo, ...{ sku: '', desc: '' } }
          }

        });
        let returnData = {
          status,
          message,
          labelData
        }
        callback(returnData);
      });
    });
  });
};