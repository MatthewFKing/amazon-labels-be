const express = require('express');
const router = express.Router();
const qaLog = require("../helpers/qaSheet").qaLog;
const singleTech = require("../helpers/qaSheet").singleTech;
const qaEntry = require('../models/QAEntry');
const tech = require('../models/Tech');
const qaArchive = require("../helpers/qaSheet").archiveLog;
const fbaArchive = require("../helpers/qaSheet").archiveFbaLog;
const prodReports = require("../helpers/prodReports");
const moment = require('moment');
const schedule = require('node-schedule');


router.get('/', (req, res, next) => {
  res.send('qa');
});

router.post('/techreport', async (req, res, next) => {
  prodReports.techReport(req.body.number, (returnData) => {
    res.json(returnData);
  });
});

router.get('/reports', async(req, res, next) => {
  console.log(req.ip);
  console.log('/reports')
  const list = await qaEntry.find({});
  prodReports.workingDays(list, (returnData) => {
    res.json(returnData);
  });
});

router.get('/archive', async (req, res, next) => {
  console.log(req.ip);
  console.log('/archive')
  fbaArchive('data', (entries) =>{
    entries.forEach(entry => {
            const newEntry = new qaEntry(entry);
            newEntry.save((err, id) => {
                if (err) return console.log(`${err} at ${id}`);
            });
        });
      res.json(entries.length);
    });
  });

router.post('/qalog', async (req, res, next) => {
  console.log(req.ip);
  console.log('/qalog')
  let qaEntries = await qaEntry.findByNumber(req.body.number);
  singleTech(qaEntries, (returnData) => {
      res.json(returnData);
  });
});

router.post('/qasearch', async (req, res, next) => {
  console.log(req.ip);
  console.log('/qasearch')
  const { type, date } = req.body;
  const query = req.body.query;

  
  let finder = {};
  if (type && query) {
    let searchList = [];
    query.map(value => {
      searchList.push({ [type]: { "$regex": value, "$options": "i" } })
    });
    console.log(searchList);
    //finder[type] = { "$regex": query, "$options": "i" }
    finder['$or'] = searchList
  }
  if (date) {
    finder.date = {"$gte": date.start, "$lt": date.end};
  }
  //console.log(finder)

  const match = await qaEntry.find(finder).sort({ date: 1 }).limit(5000);
  res.json(match);
});

router.get('/updatelog', async (req, res, next) => {
  console.log(req.ip);
  console.log('/updatelog')
  const del = await qaEntry.deleteMany({ this_month: true });
  
  qaLog(del, (entries) => {
      // entries.forEach(entry => {
      //     const newEntry = new qaEntry(entry);
      //     newEntry.save((err, id) => {
      //         if (err) return console.log(err);
      //     });
      // });
      res.json(entries)
  });
});

const j = schedule.scheduleJob('*/30 * * * *', async () => {
  console.log('updatelog')
  const del = await qaEntry.deleteMany({ this_month: true });
  qaLog(del, (entries) => {
    entries.forEach(entry => {
        const newEntry = new qaEntry(entry);
        newEntry.save((err, id) => {
            if (err) return console.log(err);
        });
    });
    console.log(entries.length);
});
});

router.post('/addtech', async (req, res, next) => {
  console.log(req.ip);
  console.log('/addtech')
  //console.log(req.body);
  req.body.map(techInfo => {
      const newTech = new tech(techInfo);
      newTech.save((err, id) => {
          if (err) return console.log(err);
      });
  });
  res.send('got it')
});

router.get('/updatemonth', async (req, res, next) => {
  console.log(req.ip);
  console.log('/updatemonth')
  const update = await qaEntry.updateMany({this_month: true}, {this_month: false});
  res.json(update.nModified);
});

router.get('/qainfo', async (req, res, next) => {
  console.log(req.ip);
  console.log('/qainfo')
  //console.log(req.body);
  tech.find({}, (err, techs) => {
      res.json(techs);
  });
});

router.get('/qareport', (req, res, next) => {
  qaEntry.find({ tech_number: '43674645' }, (err, entries) => {
      res.json(entries);

  });
});

module.exports = router;