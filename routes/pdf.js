const express = require('express');
const router = express.Router();
const helpers = require('../helpers/pdfHelpers');
const fs = require('fs');
const path = require('path');

const sheets = require('../helpers/sheets');

const deleteFiles = (dir) => {
  const directory = dir;
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

router.post('/final', (req, res, next) => {
  let time = req.body.time;
  console.log(req.ip);
  console.log(new Date().toLocaleTimeString());
  fs.readFile(`./tmp/${time}-final.pdf`, function (err, data) {
    res.contentType("application/pdf");
    res.send(data);
    deleteFiles('./cropped');
    deleteFiles('./images');
    deleteFiles('./tmp');
  });

});

router.post('/', (req, res, next) => {
  let file = req.files.file;
  let time = Date.now();
  file.mv(`./tmp/${time}.pdf`, function (err) {
    if (err) {
      return res.status(500).send(err);
    } else {
      helpers.pdfToPic(time, function (time) {
        res.json(time);
      })
    }
  });
});

router.post('/fn', (req, res, next) => {
  let data = req.body;
  deleteFiles('./data/labels');

  sheets.fnSku(data, function (woList) {
    if (woList.status === 'missing') {
      res.json({ message: woList.message });
    } else {
      helpers.fnsku(woList.labelData, function (result) {
        res.send(result.file);
      });
    }
  });
});

router.post('/fn-final', (req, res, next) => {
  fs.readFile(req.body.file, function (err, data) {
    res.contentType("application/pdf");
    res.send(data);
    deleteFiles('./data/barcodes');

  });
})


module.exports = router;