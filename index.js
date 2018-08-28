const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const helpers = require('./helpers/pdfHelpers');
const neebHelpers = require('./helpers/neebHelpers');
const fs = require('fs');
const stringify = require('csv-stringify');
const path = require('path');
const mongoose = require('mongoose');
const completedNE = require('./models/CompletedNE');
const csv = require("csvtojson");
const waitOn = require('wait-on');

mongoose.connect('mongodb://localhost/warehouse', {
    useNewUrlParser: true
});

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

app.use(bodyParser.urlencoded({
    limit: '1gb',
    extended: false
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.raw({
    limit: '1gb',
    type: 'application/pdf'
}));

app.use(fileUpload());

app.use(cors());
app.options('*', cors());

const caRoute = require('./routes/ca');
const roRoute = require('./routes/ro');
app.use('/ro', roRoute);
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
//Newegg Ebay Order Report
app.post('/neebreport', (req, res, next) => {
    const file = req.files.file;

    const timeStamp = Date.now();

    file.mv(`./reporttmp/${timeStamp}.xls`)
        .then(file => {

            waitOn({
                resources: [`./reporttmp/${timeStamp}.xls`]
            }, function (err) {
                if (err) {
                    return handleError(err);
                }
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
                                    const completeNE = new completedNE({
                                        ID: order
                                    });
                                    completeNE.save((err, id) => {
                                        if (err) return next(err);
                                    });
                                });
                            }
                            stringify(returnValue.fbReport, function (err, fbReport) {
                                res.contentType('text/csv');
                                res.send({
                                    fbReport
                                });
                            });
                        });
                    } else {

                        const data = {
                            orderList,
                            timeStamp
                        };

                        neebHelpers.neConverter(data, (returnValue) => {
                            if (returnValue.currentOrders) {
                                returnValue.currentOrders.map(order => {
                                    const completeNE = new completedNE({
                                        ID: order
                                    });
                                    completeNE.save((err, id) => {
                                        if (err) return next(err);
                                    });
                                });
                            }
                            stringify(returnValue.fbReport, function (err, fbReport) {
                                res.contentType('text/csv');
                                res.send({
                                    fbReport
                                });
                            });
                        });
                    }
                });
            });
        });
});

app.post('/ebreport', (req, res, next) => {
    console.log(req.id);
    neebHelpers.ebConverter(req.body, (returnValue) => {
        stringify(returnValue, function (err, fbReport) {
            res.contentType('text/csv');
            res.send({
                fbReport
            });
        });
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