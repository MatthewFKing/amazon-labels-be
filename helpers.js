exports.pdfToPic = (query, callback) => {
    let PDF2Pic = require('pdf2pic').default
    const imagemagickCli = require('imagemagick-cli');
    let test = query;
    let converter = new PDF2Pic({
        density: 300,           // output pixels per inch
        savename: "test",   // output file name
        savedir: "./images",    // output file location
        format: "png",          // output file format
        size: 1700

    })

    converter.convertBulk("./tmp/test.pdf", -1)
        .then(done => {
            imagemagickCli.exec('convert -crop 1700x1100 -gravity center -trim ./images/*.png ./cropped/cropped_%d.png')
                .then(result1 => {
                    console.log('cropped', query)
                    imagemagickCli.exec('convert ./cropped/* -page 1275x852 myfile.pdf') //-extent 1700x1100 -page 1275x852
                        .then(result => {
                            callback(result);
                        });
                });
        })
};

exports.ro = (query, callback) => {
    let data = query.map(line => {
        return line[1];
    });
    callback([...new Set(data)]);
}

exports.roGen = (data, callback) => {

    let report = data.report;
    let poList = data.poList;

    const parts = require('./part.json');


    let reducedReport = report.filter(line => {
        return poList.indexOf(line[1]) > -1 ? line : null;
    });

    reducedReport.map(line => {
        line[5] = line[5].replace('-FBA', '').replace(/[-]\d$/, '');
    });

    let unfoundParts = reducedReport.filter(line => {
        return !parts.find(part => {
            return part.PartNumber === line[5];
        });
    });

    let missingParts = unfoundParts.map(line => {
        return line[5]
    });

    let partsSheet = partsImport(unfoundParts, Object.getOwnPropertyNames(parts[0]));
    let dataCallBack = {report: fbRoReport(reducedReport), missingParts}
    callback(dataCallBack);
}

const partJSON = () => {
    const csv = require('csvtojson')
    const partCSV = 'Part.csv';

    csv()
        .fromFile(partCSV)
        .on('json',(jsonObj)=>{
            let partJson = jsonObj;
        });
}

const partsImport = (parts, headers) => {
    let neededParts = parts.map(part => {
        return [part[5], ...Array(headers.length-1).fill('')];
    });
    let report = [headers, ...neededParts];

    return report;
}

const fbRoReport = (parts) => {
    const headers = require('./headers.js');
    const today = new Date().toLocaleDateString()
    const stringify = require('csv-stringify');
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
        poLine[9] = today;
        report.push(poLine);
        
        for(let x = 0; x < parts.length; x++) {
            if (parts[x][1] === poList[i]) {
                let itemLine = headers.roItemLine.split(',');
                itemLine[2] = `${parts[x][5]}-UF`;
                itemLine[3] = `${parts[x][5]}-UF`;
                itemLine[4] = parts[x][8];
                itemLine[9] = today;
                itemLine[10] = today;
                report.push(itemLine);
            }
        }
    }
    return report;
}

//[-]\d$