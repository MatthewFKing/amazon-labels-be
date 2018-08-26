exports.ro = (query, callback) => {
  let data = query.map(line => {
      return line[1];
  });
  callback([...new Set(data)]);
}

exports.roGen = (data, callback) => {
  const parts = require('../data/part.json');
  const stringify = require('csv-stringify');

  let report = data.report;
  let poList = data.poList;

  let reducedReport = report.filter(line => {
      return poList.indexOf(line[1]) > -1 ? line : null;
  });

  reducedReport.map(line => {
      line[5] = line[5].replace('-FBA', '').replace(/[-]\d$/, '');
  });

  let unfoundParts = reducedReport.filter(line => {
      return !parts.find(part => {
          return part.PartNumber === `${line[5]}-UF`;
      });
  });

  let missingParts = unfoundParts.map(line => {
      return line[5]
  });

  //building response data
  //needs: TO Report, Part import, Add Inventory

  let dataCallBack = {
      report: fbRoReport(reducedReport),
      partReport: partsImport(missingParts),
      invImport: invAdd(reducedReport, data.ufNumber)
  };

  callback(dataCallBack);
}

exports.partList = (data, callback) => {
  const csv = require('csvtojson')
  const partCSV = './reporttmp/parts.csv';

  csv()
      .fromFile(partCSV)
      .on('json', (jsonObj) => {
          let partJson = jsonObj;
      });
}

const partJSON = () => {
  const csv = require('csvtojson')
  const partCSV = 'Part.csv';

  csv()
      .fromFile(partCSV)
      .on('json', (jsonObj) => {
          let partJson = jsonObj;
      });
}

const partsImport = (parts) => {
  const partsExport = require('../data/part.json');
  const headers = require('./headers');

  let partsReport = [];
  partsReport.push(headers.partsHeader.split(',').splice(0,21));

  parts.map(part => {
      let foundPart = partsExport.find(fbPart => {
          return fbPart.PartNumber === part
      });
      let partLine = foundPart ? Object.values(foundPart) : headers.partsItem.split(',');
      partLine[0] = `${part}-UF`;
      partLine.splice(21);
      partsReport.push(partLine);
  });
  return partsReport;
}

const invAdd = (parts, startingUF) => {
  const ufNumber = require('../models/UF');
  const partsExport = require('../data/part.json');
  const headers = require('./headers.js');

  let invReport = [];
  invReport.push(headers.invHeader1.split(','));

  parts.map(line => {
      let itemLine = headers.invItem.split(',');
      let tracking = partsExport.find(fbPart => {
          return fbPart.PartNumber === line[5];
      });
      itemLine[0] = `${line[5]}-UF`;
      itemLine[3] = line[8];
      itemLine[8] = !tracking || tracking['Tracks-Lot Number'] === "true" ? "UNFULFILLABLE" : "";
      invReport.push(itemLine);
      if (tracking && tracking['Tracks-Serial Number'] === "true") {
          invReport.push(headers.invSN.split(','));
          for (let x = 0; x < parseInt(line[8]); x++) {
              let ufLine = headers.invUF.split(',');
              ufLine[0] = `UF00${startingUF}`;
              startingUF++;
              invReport.push(ufLine);
          }
      }
  });

  const newUFNumber = new ufNumber({current: startingUF});
  newUFNumber.save((err, ufnum) => {
      if (err) return next(err);
      console.log(ufnum);
      
  });
  return invReport;
  
};

const fbRoReport = (parts) => {
  const headers = require('./headers.js');
  const today = new Date().toLocaleDateString()
  const fs = require('fs');

  let report = [];
  report.push(headers.roHeader1.split(','));
  report.push(headers.roHeader2.split(','));

  let poList = parts.map(line => {
      return line[1];
  });

  poList = [...new Set(poList)];

  for (let i = 0; i < poList.length; i++) {
      let poLine = headers.roPoLine.split(',');
      poLine[1] = poList[i];
      poLine[20] = today;
      poLine[21] = today;
      poLine[23] = today;
      report.push(poLine);

      for (let x = 0; x < parts.length; x++) {
          if (parts[x][1] === poList[i]) {
              let itemLine = headers.roItemLine.split(',');
              itemLine[1] = `${parts[x][5]}-UF`;
              itemLine[2] = parts[x][8];
              itemLine[4] = today;
              report.push(itemLine);
          }
      }
  }
  return report;
}