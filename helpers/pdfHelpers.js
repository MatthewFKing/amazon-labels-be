
exports.pdfToPic = (query, callback) => {
    let PDF2Pic = require('pdf2pic').default
    const imagemagickCli = require('imagemagick-cli');
    let time = query;
    let converter = new PDF2Pic({
        density: 300,           // output pixels per inch
        savename: "test",   // output file name
        savedir: "./images",    // output file location
        format: "png",          // output file format
        size: 1700

    });

    converter.convertBulk(`./tmp/${time}.pdf`, -1)
        .then(done => {
            imagemagickCli.exec('convert -crop 1700x1100 -gravity center -trim ./images/*.png ./cropped/cropped_%d.png')
                .then(result1 => {
                    imagemagickCli.exec(`convert ./cropped/* -page 1275x852 ./tmp/${time}-final.pdf`) //-extent 1700x1100 -page 1275x852
                        .then(result => {
                            callback(time);
                        });
                });
        });
};

exports.fnsku = (data, callback) => {
    const HummusRecipe = require('hummus-recipe');
    const bwipjs = require('bwip-js');
    const waitOn = require('wait-on');

    const textOptions = { font: 'Arial', size: 12, color: "#FFFFFF" };
    let total = data.reduce((tally, wo) => {
        return tally + parseInt(wo.qty);
    }, 0)
    console.log(total);
    let count = 1;
    console.log(data);
    data.map(wo => {

        bwipjs.toBuffer({
            bcid: 'code128',       // Barcode type
            text: wo.fnsku,    // Text to encode
            scale: 1,               // 3x scaling factor
            height: 20,              // Bar height, in millimeters
            includetext: false,            // Show human-readable text
            textxalign: 'center',        // Always good to set this
        }, function (err, png) {
            if (err) {

            } else {
                require("fs").writeFile(`./data/barcodes/${wo.woNum}.png`, png, 'base64', function (err) {
                    for (let x = 1; x <= parseInt(wo.qty); x++) {
                        console.log(count);

                        if (count === 1 && x === 1) {
                            const pdfDoc = new HummusRecipe('./data/FNSKULabel.pdf', `./data/labels/output-${count}.pdf`);
                            pdfDoc
                                // edit 1st page
                                .editPage(1)
                                .text(wo.sku, 62, 61, textOptions) //SKU
                                .text(wo.desc, 145, 18, { font: 'Arial', size: 12, color: "#FFFFFF", align: 'center center' }) //Desc
                                .text(wo.asin, 65, 110, textOptions) //UPC
                                .text(`FNSKU: ${wo.fnsku}`, 145, 212, { font: 'Arial', size: 12, color: "#000000", align: 'center center' }) //FNsku Barcode
                                .image(`./data/barcodes/${wo.woNum}.png`, 145, 150, { align: 'center' })
                                .endPage()
                                // end and save
                                .endPDF();
                        } else {
                            let pdfDoc = new HummusRecipe(`./data/labels/output-${count - 1}.pdf`, `./data/labels/tmp-${count}.pdf`);

                            pdfDoc
                                .insertPage(count - 1, './data/FNSKULabel.pdf', 1)
                                .endPage()
                                // end and save
                                .endPDF();

                            pdfDoc = new HummusRecipe(`./data/labels/tmp-${count}.pdf`, `./data/labels/output-${count}.pdf`);

                            pdfDoc
                                .editPage(count)

                                .text(wo.sku, 62, 61, textOptions) //SKU
                                .text(wo.desc, 145, 18, { font: 'Arial', size: 12, color: "#FFFFFF", align: 'center center' }) //Desc
                                .text(wo.asin, 65, 110, textOptions) //UPC
                                .text(`FNSKU: ${wo.fnsku}`, 145, 212, { font: 'Arial', size: 12, color: "#000000", align: 'center center' }) //FNsku Barcode
                                .image(`./data/barcodes/${wo.woNum}.png`, 145, 150, { align: 'center' })
                                .endPage()
                                .endPDF();
                        }
                        count++;
                    }

                });
            }
        });
    });
    waitOn({
        resources: [`./data/labels/output-${total}.pdf`]
      }, function (err) {
        callback({ file: `./data/labels/output-${total}.pdf` });
      });
    
}

//FNKU Labels
//form to enter in sku information
//DB for SKU, FNSKU, Description, UPC
//Edit PDF
//Add barcode to PDF
//preview PDF to print
