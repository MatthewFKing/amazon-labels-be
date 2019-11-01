const moment = require('moment');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../client_secret.json');
const doc = new GoogleSpreadsheet('1W3IeQTmiEpmt1_5V9nzJFrnUu5OE8T_1LeF7bGukizs');

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
            fb_status: row._cokwr,
            order_id: row.invoicepo,
            invoice_number: row.invoicepo_2,
            serial: row.serial,
            model: row.model,
            sku: row.upgradefbsku,
            shipping_method: row.shipping,
            must_ship: row.mustship,
            tech_number: row.tech,
            qa: {
              blemish_spec: row.blemishspec,
              final_qa: row.finalqasignature,
              checked_at: row.checkedat,
              checked_in_by: row.checkedinby
            },
            tracking_number: row.tracking,
            points_value: row._db1zf,
            time_checked_in: time,
            notes: row.notes,
            this_month: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month'),
            fulfillment_type: 'Production'

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
              order_id: row.wonumber,
              invoice_number: row.wonumber,
              serial: row.serial,
              model: row.model,
              sku: row.upgradefbsku,
              tech_number: row.tech,
              qa: {
                blemish_spec: row.blemishspec,
                final_qa: row.finalqasignature,
                checked_at: row.checkedat,
                checked_in_by: row.checkedinby
              },
              points_value: row._cu76f,
              time_checked_in: time,
              notes: row.notes,
              full_test: row.fulltest,
              this_month: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month'),
              fulfillment_type: 'FBA'
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

exports.singleTech = (data, callback) => {
  const qaEntries = data;
  let pointData = [];

  dates.forEach((date, i) => {
    let pointTotal = qaEntries.filter(entry => moment(entry.date).format('L') === date).reduce((total, line) => {
      if (!isNaN(parseInt(line.points_value, 10))) {
        return total + parseInt(line.points_value, 10);
      } else {
        return total + 0;
      }
    }, 0);
    pointData.push([i, pointTotal]);
  });

  callback({ dates, pointData });
}

exports.updateNpuLog = (callback) => {
  doc.useServiceAccountAuth(creds, function (err) {
    // Production Log
    doc.getRows(2, (err, rows) => {
      const entries = [];
      let time = '';
      rows.forEach(row => {
        if (row.timecheckedin) {
          time = row.timecheckedin;
        }

        if (row.timestamp) {
          let entry = {
            date: row.timestamp,
            email_address: row.emailaddress,
            invoice_number: row.invoicenumber,
            brand: row.pcbrand,
            sku: row.fishbowlsku,
            serial_number: row.serialnumber,
            cpu: row.processor,
            gpu: row.graphics,
            ram: row.ramquantityandconfiguration,
            hdd: row.hddssdmsatastoragemedia,
            odd: row.opticaldiskdriveodd,
            screen_resolution: row.screenresolutionandfinishglossymatte,
            os: row.operatingsystem,
            new: row.neworpreviouslyopened,
            damage_desc: row.describedamageissue,
            damage_loc: row.damagelocation,
            missing_packaging: row.anymissingpackagingaccessoriesadapters,
            functional: row.functional,
            tech_caused: row.didthetechcausethedamage,
            cpar_level: row.cparlevel,
            qa_approval: row.qaapprovaltosubmittheformqainitials,
            notes: row.notes,
            unit_cost: row.costofunit,
            tech_number: row.cmdtech,
            tech_name: row.techname,
            team: row.team,

          }

          entries.push(entry);
        }
      });

      callback(entries);
    });
  });
}


exports.archiveLog = (data, callback) => {

  const logData = require('../data/qa_prod_archive.json');
  console.log(logData.length);


  const entries = [];
  let time = '';
  logData.forEach(row => {
    if (row.timeCheckedIn) {
      time = row.timeCheckedIn;
    }

    if (row.invoicepo) {
      let entry = {
        date: row.date,
        fb_status: row.fb,
        order_id: row.orderid,
        invoice_number: row.invoicepo,
        serial: row.serial,
        model: row.model,
        sku: row.upgradeFbSku,
        shipping_method: row.shipping,
        must_ship: row.brand,
        tech_number: row.technumber,
        qa: {
          blemish_spec: row.blemishspec,
          final_qa: row.finalqa,
          checked_at: row.checkedat,
          checked_in_by: row.checkedinby
        },
        tracking_number: row.tracking,
        points_value: row.points,
        time_checked_in: time,
        notes: row.notes,
        this_month: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month')
      }

      entries.push(entry);
    }
  });
  callback(entries);
}


exports.archiveLog = (data, callback) => {

  const logData = require('../data/2018_qa_prod_archive.json');
  console.log(logData.length);


  const entries = [];
  let time = '';
  logData.forEach(row => {
    if (row.timeCheckedIn) {
      time = row.timeCheckedIn;
    }

    if (row.invoicepo) {
      let entry = {
        date: row.date,
        fb_status: row.fb,
        order_id: row.orderid,
        invoice_number: row.invoicepo,
        serial: row.serial,
        model: row.model,
        sku: row.upgradeFbSku,
        shipping_method: row.shipping,
        must_ship: row.brand,
        tech_number: row.technumber,
        qa: {
          blemish_spec: row.blemishspec,
          final_qa: row.finalqa,
          checked_at: row.checkedat,
          checked_in_by: row.checkedinby
        },
        tracking_number: row.tracking,
        points_value: row.points,
        time_checked_in: time,
        notes: row.notes,
        this_month: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month')
      }

      entries.push(entry);
    }
  });
  callback(entries);
}

exports.archiveFbaLog = (data, callback) => {

  const logData = require('../data/2018_qa_fba_archive.json');
  console.log(logData.length);


  const entries = [];
  let time = '';
  logData.forEach(row => {
    if (row.timeCheckedIn) {
      time = row.timeCheckedIn;
    }

    if (row.woNumber) {
      let fbaentry = {
        date: row.date,
        order_id: row.woNumber,
        invoice_number: row.wonumber,
        serial: row.serial,
        model: row.model,
        sku: row.upgradeFbSku,
        tech_number: row.tech,
        qa: {
          blemish_spec: row.blemishSpec,
          final_qa: row.finalQaSignature,
          checked_at: row.checkedAt,
          checked_in_by: row.checkedInBy
        },
        points_value: row.points,
        time_checked_in: time,
        notes: row.notes,
        full_test: row.fulltest,
        this_month: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month')
      }
      entries.push(fbaentry);
    }
  });
  callback(entries);
}



exports.qaLogLastMonth = (data, callback) => {
  var GoogleSpreadsheet = require('google-spreadsheet');


  var creds = require('../client_secret.json');
  var doc = new GoogleSpreadsheet('1W3IeQTmiEpmt1_5V9nzJFrnUu5OE8T_1LeF7bGukizs');

  doc.useServiceAccountAuth(creds, function (err) {
    // Production Log
    doc.getRows(7, (err, rows) => {
      const entries = [];
      let time = '';
      rows.forEach(row => {
        if (row.timecheckedin) {
          time = row.timecheckedin;
        }

        if (row.invoicepo) {
          let entry = {
            date: row.date,
            fb_status: row._cokwr,
            order_id: row.invoicepo,
            invoice_number: row.invoicepo_2,
            serial: row.serial,
            model: row.model,
            sku: row.upgradefbsku,
            shipping_method: row.shipping,
            must_ship: row.mustship,
            tech_number: row.tech,
            qa: {
              blemish_spec: row.blemishspec,
              final_qa: row.finalqasignature,
              checked_at: row.checkedat,
              checked_in_by: row.checkedinby
            },
            tracking_number: row.tracking,
            points_value: row._db1zf,
            time_checked_in: time,
            notes: row.notes,
            this_month: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month'),
            fulfillment_type: 'Production'

          }

          entries.push(entry);
        }
      });
      // FBA Production Log
      doc.getRows(8, (err, fbaRows) => {
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
              order_id: row.wonumber,
              invoice_number: row.wonumber,
              serial: row.serial,
              model: row.model,
              sku: row.upgradefbsku,
              tech_number: row.tech,
              qa: {
                blemish_spec: row.blemishspec,
                final_qa: row.finalqasignature,
                checked_at: row.checkedat,
                checked_in_by: row.checkedinby
              },
              points_value: row._cu76f,
              time_checked_in: time,
              notes: row.notes,
              full_test: row.fulltest,
              this_month: moment(row.date, "MM-DD-YYYY").isSame(moment(), 'month'),
              fulfillment_type: 'FBA'
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

