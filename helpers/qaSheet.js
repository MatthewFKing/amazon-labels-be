//exports.qaLog = (data, callback) => {
  var GoogleSpreadsheet = require('google-spreadsheet');
  const moment = require('moment');
  var creds = require('../client_secret.json');
  var doc = new GoogleSpreadsheet('1W3IeQTmiEpmt1_5V9nzJFrnUu5OE8T_1LeF7bGukizs');

  doc.useServiceAccountAuth(creds, function (err) {
    // Production Log
    doc.getRows(5, (err, rows) => {
      const entries = [];
      let time = '';
      rows.forEach(row => {
        if (row.timecheckedin) {
          time = row.timecheckedin;
        }

        if (row.invoicepo) {
        let entry = {
          date: row.date,
          fbStatus: row._cokwr,
          orderID: row.invoicepo, 
          invoiceNumber: row.invoicepo_2,
          serial: row.serial,
          model: row.model,
          sku: row.upgradefbsku,
          shippingMethod: row.shipping,
          mustShip: row.mustship,
          techNumber: row.tech,
          qa: {
            blemishSpec: row.blemishspec,
            finalQA: row.finalqasignature,
            checkedAt: row.checkedat,
            checkedInBy: row.checkedinby
          },
          trackingNumber: row.tracking,
          pointsValue: row._db1zf,
          timeCheckedIn: time,
          notes: row.notes,
          isThisMonth: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month')
        }
      
        entries.push(entry);
      }
      });
      // FBA Production Log
      doc.getRows(6, (err, fbaRows) => {
        //console.log(fbaRows);

        // let date = fbaRows.filter(row =>  row.timecheckedin).map(line => {
        //   return [line.wonumber, line.timecheckedin]
        // });
        //console.log(date);
        let time = '';
        fbaRows.forEach(row => {
          if (row.timecheckedin) {
            time = row.timecheckedin;
          }
          //console.log(time);
          if (row.wonumber) {
          let fbaentry = {
            date: row.date,
            orderID: row.wonumber, 
            invoiceNumber: row.wonumber,
            serial: row.serial,
            model: row.model,
            sku: row.upgradefbsku,
            techNumber: row.tech,
            qa: {
              blemishSpec: row.blemishspec,
              finalQA: row.finalqasignature,
              checkedAt: row.checkedat,
              checkedInBy: row.checkedinby
            },
            pointsValue: row._cu76f,
            timeCheckedIn: time,
            notes: row.notes,
            fullTest: row.fulltest,
            isThisMonth: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month')
          }
          entries.push(fbaentry);
        }
        })
        console.log(entries);
      });
      
    });
  });
//}

