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

    let partsSheet = partsImport(unfoundParts, Object.getOwnPropertyNames(parts[0]));
    callback(partsSheet);
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


//[-]\d$