const express = require('express');
const router = express.Router();
const waitOn = require('wait-on');
const helpers = require('../helpers/caHelpers');
const stringify = require('csv-stringify');

router.get('/', (req, res, next) => {
  res.send('ca orders');
});

router.post('/', (req, res, next) => {
  const file = req.files.file;

  const timeStamp = Date.now();

  file.mv(`./reporttmp/${timeStamp}CA.xls`)
    .then(file => {
      waitOn({
        resources: [`./reporttmp/${timeStamp}CA.xls`]
      }, function (err) {
        const data = { timeStamp };
        helpers.neCaConverter(data, (returnValue) => {
          res.send(returnValue);
        });
      });
    });
});

router.post('/gen', (req, res, next) => {
  helpers.generate(req.body, (returnValue) => {
    stringify(returnValue, function (err, fbReport) {
      res.contentType('text/csv');
      res.send({
        fbReport
      });
    });
  });
});

router.post('/amz/gen', (req, res, next) => {
  helpers.amzGenerate(req.body, (returnValue) => {
    stringify(returnValue, function (err, fbReport) {
      res.contentType('text/csv');
      res.send({
        fbReport
      });
    });
  })
});

module.exports = router;