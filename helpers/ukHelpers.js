const ukGenerate = exports.ukGenerate = (data, callback) => {
  let clearedOrders = data.clearedOrders;
  let allOrders = data.caAllOrders;
  let unshippedOrders = data.caUnshippedOrders;

  let fbReport = [];
  fbReport.push(headers.header1.split(','));
  fbReport.push(headers.header2.split(','));

  clearedOrders.forEach(order => {
    let allReport = allOrders.find(id => id[0] === order);
    let unshippedReport = unshippedOrders.find(id => id[0] === order);

    let soLine = headers.line.split(',');

    soLine[3] = unshippedReport[19];
    soLine[4] = unshippedReport[19];
    soLine[5] = unshippedReport[19];
    soLine[6] = `${unshippedReport[20]}\n${unshippedReport[21]}`;
    soLine[7] = unshippedReport[24];
    soLine[8] = unshippedReport[25];
    soLine[9] = unshippedReport[26];
    soLine[10] = unshippedReport[27];
    soLine[11] = unshippedReport[19];
    soLine[12] = `${unshippedReport[20]}\n${unshippedReport[21]}`;
    soLine[13] = unshippedReport[24];
    soLine[14] = unshippedReport[25];
    soLine[15] = unshippedReport[26];
    soLine[16] = unshippedReport[27];
    soLine[20] = unshippedReport[0];
    soLine[22] = moment(unshippedReport[2]).format('L');
    soLine[25] = "Amazon.com - FBM";
    soLine[30] = moment(unshippedReport[5]).format('L');
    soLine[34] = unshippedReport[10];
    soLine[35] = unshippedReport[7];
    soLine[36] = moment(unshippedReport[5]).format('L');
    soLine[32] = "Worldwide Expedited"

    fbReport.push(soLine);

    let itemLine = headers.item.split(',');

    itemLine[2] = unshippedReport[11];
    itemLine[4] = unshippedReport[14];
    itemLine[6] = allReport[19];
    itemLine[9] = allReport[12];
    itemLine[11] = moment(unshippedReport[5]).format('L');

    fbReport.push(itemLine);

    let shipLine = headers.shipping.split(',');

    shipLine[6] = allReport[21];
    shipLine[11] = moment(unshippedReport[5]).format('L');

    fbReport.push(shipLine);

    let gstLine = headers.gst.split(',');

    gstLine[6] = (parseFloat(allReport[20]) + parseFloat(allReport[22])).toFixed(2);
    gstLine[11] = moment(unshippedReport[5]).format('L');

    fbReport.push(gstLine);

  });

  callback(fbReport);
  
}