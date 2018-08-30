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
const pdfRoute = require('./routes/pdf');
app.use('/ro', roRoute);
app.use('/ca', caRoute);
app.use('/pdf', pdfRoute);

/////////////////////////////////////////////
//Amazon Label Generator
app.post('/pdf/final', (req, res, next) => {
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

app.post('/pdf', (req, res, next) => {
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
    neebHelpers.ebConverter(req.body, (returnValue) => {
        stringify(returnValue, function (err, fbReport) {
            res.contentType('text/csv');
            res.send({
                fbReport
            });
        });
    });
});

app.get('/nenum', (req, res, next) => {
    completedNE.find().sort({ _id: -1 }).limit(10).exec((err, data) => {
        res.json(data);
    });
});

app.post('/neid', (req, res, next) => {
    let ordersToDelete = req.body;
    ordersToDelete.forEach(order => {
        completedNE.find({ ID: order }).deleteOne().exec();
    })
    res.send('deleted')
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err);
});

const port = process.env.PORT || 3030;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:", port);