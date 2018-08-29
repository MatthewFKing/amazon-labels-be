const express = require('express');
const router = express.Router();
const stringify = require('csv-stringify');
const ufNumber = require('../models/UF');
const helpers = require('../helpers/roHelpers');
const waitOn = require('wait-on');


/////////////////////////////////////////////
//Removal Order Generator
router.post('/', (req, res, next) => {
  helpers.ro(req.body, function (returnValue) {
    res.send(returnValue);
  });
});

router.post('/gen', (req, res, next) => {
  helpers.roGen(req.body, function (returnValue) {
    let missingParts = returnValue.missingParts;
    stringify(returnValue.report, function (err, toReport) {
      stringify(returnValue.invImport, function (err, invReport) {
        stringify(returnValue.partReport, function (err, partReport) {
          res.contentType('text/csv');
          res.send({
            toReport,
            partReport,
            invReport
          });
        });
      });
    });
  });
});

/////////////////////////////////////////////
//Removal Order/Update UF Number
router.post('/ufnum', (req, res, next) => {
  const newUFNumber = new ufNumber(req.body);
  newUFNumber.save((err, ufnum) => {
    if (err) return next(err);
    res.status(201);
    res.json(ufnum);
  });
});

router.get('/ufnum', (req, res, next) => {
  ufNumber.find({}, (err, num) => {
    if (err) return next(err);
    res.status(201);
    res.json(num);
  });
});

/////////////////////////////////////////////
//Removal Order Update Parts List
router.post('/partlist', (req, res, next) => {
  const file = req.files.file;

  file.mv('./reporttmp/parts.csv')
    .then(file => {
      waitOn({
        resources: [`./reporttmp/parts.csv`]
      }, function (err) {
        if (err) {
          return handleError(err)
        }
        helpers.partList('data', (returnValue) => {
          res.send(returnValue);
        })
      });
    });
});

module.exports = router;