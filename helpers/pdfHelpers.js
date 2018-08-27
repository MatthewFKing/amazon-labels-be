
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

    });

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
        });
};