const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const helpers = require('./helpers');
const fs = require('fs');
const stringify = require('csv-stringify');
const path = require('path');

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
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '1gb', type: 'application/pdf' }));

app.use(fileUpload());

app.use(cors());

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

app.post('/neEbReport', (req, res, next) => {
    res.send('Newegg Ebay SO Report');
});


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err);
});

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:", port);