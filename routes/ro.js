const express = require('express');
const router = express.Router();
const stringify = require('csv-stringify');
const ufNumber = require('../models/UF');
const helpers = require('../helpers/roHelpers');
const waitOn = require('wait-on');
const part = require('../models/Parts');


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
router.post('/partlist', async (req, res, next) => {
  //let parts = await req.body;
  const del = await part.deleteMany({});
  console.log(req.body.data)
  helpers.partList(req.body.data, (returnData) => {
      part.insertMany(returnData)
        .then(docs => {

        })
        .catch(err => {
          console.log(err)
        });
    res.json(del.deletedCount);
  })
});

module.exports = router;