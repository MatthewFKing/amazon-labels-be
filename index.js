const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const helpers = require('./helpers');
const neebHelpers = require('./neebHelpers');
const fs = require('fs');
const stringify = require('csv-stringify');
const path = require('path');
const mongoose = require('mongoose');
const ufNumber = require('./models/UF');
const completedNE = require('./models/CompletedNE');
const csv = require("csvtojson");
const waitOn = require('wait-on');

mongoose.connect('mongodb://localhost/warehouse', { useNewUrlParser: true });

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


app.use(bodyParser.urlencoded({ limit: '1gb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ limit: '1gb', type: 'application/pdf' }));

app.use(fileUpload());

app.use(cors());
app.options('*', cors());

const caRoute = require('./routes/ca');
app.use('/ca', caRoute);

/////////////////////////////////////////////
//Amazon Label Generator
app.get('/pdf', (req, res, next) => {
    console.log(req.ip);
    console.log(new Date().toLocaleTimeString());
    fs.readFile('./myfile.pdf', function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
    deleteFiles('./cropped');
    deleteFiles('./images');
});

app.post('/pdf', (req, res, next) => {
    let file = req.files.file;
    let ip = req.ip;
    file.mv(`./tmp/test.pdf`, function (err) {
        if (err) {
            return res.status(500).send(err);
        } else {
            helpers.pdfToPic(ip, function (returnValue) {
                res.send(returnValue);
            })
        }
    });
});

/////////////////////////////////////////////
//Removal Order Generator
app.post('/ro', (req, res, next) => {
    helpers.ro(req.body, function (returnValue) {
        res.send(returnValue);
    });
});

app.post('/roGen', (req, res, next) => {
    helpers.roGen(req.body, function (returnValue) {
        let missingParts = returnValue.missingParts;
        stringify(returnValue.report, function (err, toReport) {
            stringify(returnValue.invImport, function (err, invReport) {
                stringify(returnValue.partReport, function (err, partReport) {
                    res.contentType('text/csv');
                    res.send({ toReport, partReport, invReport });
                });
            });
        });
    });
});

/////////////////////////////////////////////
//Removal Order/Update UF Number
app.post('/ufnum', (req, res, next) => {
    const newUFNumber = new ufNumber(req.body);
    newUFNumber.save((err, ufnum) => {
        if (err) return next(err);
        res.status(201);
        res.json(ufnum);
    });
});

app.get('/ufnum', (req, res, next) => {
    ufNumber.find({}, (err, num) => {
        if (err) return next(err);
        res.status(201);
        res.json(num);
    })
});

/////////////////////////////////////////////
//Removal Order Update Parts List
app.post('/partlist', (req, res, next) => {
    helpers.partList('data', function (returnValue) {
        res.send(returnValue);
    });
});

/////////////////////////////////////////////
//Newegg Ebay Order Report
app.post('/neebreport', (req, res, next) => {
    const file = req.files.file;

    const timeStamp = Date.now();

    file.mv(`./reporttmp/${timeStamp}.xls`)
        .then(file => {

            waitOn({ resources: [`./reporttmp/${timeStamp}.xls`] }, function (err) {
                if (err) { return handleError(err); }
                completedNE.find({}, function (err, ids) {
                    var orderList = [];
                    ids.forEach(id => orderList.push(id.ID));

                    if (req.body.ebReport) {
                        const data = {
                            neData: {
                                orderList,
                                timeStamp,
                            },
                            ebData: req.body
                        };
                        neebHelpers.neebConverter(data, (returnValue) => {
                            if (returnValue.currentOrders) {
                                returnValue.currentOrders.map(order => {
                                    const completeNE = new completedNE({ ID: order });
                                    completeNE.save((err, id) => {
                                        if (err) return next(err);
                                    });
                                });
                            }
                            res.send(returnValue.fbReport);
                        })
                    } else {

                        const data = { orderList, timeStamp };

                        neebHelpers.neConverter(data, (returnValue) => {
                            if (returnValue.currentOrders) {
                                returnValue.currentOrders.map(order => {
                                    const completeNE = new completedNE({ ID: order });
                                    completeNE.save((err, id) => {
                                        if (err) return next(err);
                                    });
                                });
                            }
                            res.send(returnValue.fbReport);
                        });
                    }
                });
            });
        });

    //parse info from ebay report
    //parse info from newegg report
    //return ebay order ids to be approved
    //check through completed newegg orders
    //headers for FB report
    //return FB report for download
});

app.post('/ebreport', (req, res, next) => {
    console.log(req.id);
    neebHelpers.ebConverter(req.body, (returnValue) => {
        res.send(returnValue);
    });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err);
});

const port = process.env.PORT || 3030;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:", port);