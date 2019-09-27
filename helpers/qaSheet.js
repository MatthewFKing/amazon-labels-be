const moment = require('moment');
exports.qaLog = (data, callback) => {
  var GoogleSpreadsheet = require('google-spreadsheet');
  
  
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
        });
        //console.log(entries.length);
        callback(entries);
        // entries.forEach(entry => {
        //   const newEntry = new qaEntry(entry);
        //   newEntry.save((err, id) => {
        //     if (err) return console.log(err);
        //   });
        // });
      });
      
    });
  });
}
const dates = [ 
  '09/02/2019',
  '09/03/2019',
  '09/04/2019',
  '09/05/2019',
  '09/06/2019',
  '09/09/2019',
  '09/10/2019',
  '09/11/2019',
  '09/12/2019',
  '09/13/2019',
  '09/16/2019',
  '09/17/2019',
  '09/18/2019',
  '09/19/2019',
  '09/20/2019',
  '09/23/2019',
  '09/24/2019',
  '09/25/2019',
  '09/26/2019',
];

exports.singleTech = (data, callback) => {
  const qaEntries = data;
  // let dates = qaEntries.map(entry => {
  //   return moment(entry.date).format('L');
  //   //return entry.date;
  // });
  // dates = [...new Set(dates)].sort();

  let pointData = [];

  dates.forEach((date, i) => {
    let pointTotal = qaEntries.filter(entry => moment(entry.date).format('L') === date).reduce((total, line) => {
      if (!isNaN(parseInt(line.pointsValue, 10))) {
        return total + parseInt(line.pointsValue, 10);
      } else {
        return total + 0;
      }
    }, 0);
    pointData.push([i, pointTotal]);
  });

  console.log(pointData);
  callback({dates, pointData});
}
