const moment = require('moment');
const partsExport = require('../data/part.json');
const headers = require('./headers.js');
const fs = require('fs');


////////////////////////////////
// Send list of POs back to client
exports.ro = (query, callback) => {
    let data = query.map(line => {
        return line[1];
    });
    data.shift();
    callback([...new Set(data)]);
}


/////////////////////////////////
// Generate the Report
exports.roGen = (data, callback) => {
    const stringify = require('csv-stringify');

    let report = data.report;
    let poList = data.poList;

    let reducedReport = report.filter(line => {
        return poList.indexOf(line[1]) > -1 ? line : null;
    });

    reducedReport.map(line => {
        line[5] = line[5].replace('-FBA', '').replace(/([-]\d|[-][S])$/, '');
    });

    let unfoundParts = reducedReport.filter(line => {
        return !partsExport.find(part => {
            return part.PartNumber === `${line[5]}-UF`;
        });
    });

    let missingParts = unfoundParts.map(line => {
        return line[5]
    });

    //building response data
    //needs: TO Report, Part import, Add Inventory

    let dataCallBack = {
        report: fbRoReport(reducedReport),
        partReport: partsImport(missingParts),
        invImport: invAdd(reducedReport, data.ufNumber)
    };

    callback(dataCallBack);
}

const partsImport = (parts) => {

    const headers = require('./headers');

    let partsReport = [];
    partsReport.push(headers.partsHeader.split(',').splice(0, 21));

    parts.map(part => {
        let foundPart = partsExport.find(fbPart => {
            return fbPart.PartNumber === part
        });
        let partLine = foundPart ? Object.values(foundPart) : headers.partsItem.split(',');
        partLine[0] = `${part}-UF`;
        partLine.splice(21);
        partsReport.push(partLine);
    });
    return partsReport;
}

const invAdd = (parts, startingUF) => {
    const ufNumber = require('../models/UF');

    let invReport = [];
    invReport.push(headers.invHeader1.split(','));

    parts.map(line => {
        let itemLine = headers.invItem.split(',');
        let tracking = partsExport.find(fbPart => {
            return fbPart.PartNumber === line[5];
        });
        itemLine[0] = `${line[5]}-UF`;
        itemLine[3] = line[8];
        itemLine[8] = !tracking || tracking['Tracks-Lot Number'] === "true" ? "UNFULFILLABLE" : "";
        invReport.push(itemLine);
        if (tracking && tracking['Tracks-Serial Number'] === "true") {
            invReport.push(headers.invSN.split(','));
            for (let x = 0; x < parseInt(line[8]); x++) {
                let ufLine = headers.invUF.split(',');
                ufLine[0] = `UF00${startingUF}`;
                startingUF++;
                invReport.push(ufLine);
            }
        }
    });

    const newUFNumber = new ufNumber({
        current: startingUF
    });
    newUFNumber.save((err, ufnum) => {
        if (err) return next(err);
        console.log(ufnum);

    });
    return invReport;

};

const fbRoReport = (parts) => {
    const today = moment().format('L');

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
        poLine[20] = today;
        poLine[21] = today;
        poLine[23] = today;
        report.push(poLine);

        for (let x = 0; x < parts.length; x++) {
            if (parts[x][1] === poList[i]) {
                let itemLine = headers.roItemLine.split(',');
                itemLine[1] = `${parts[x][5]}-UF`;
                itemLine[2] = parts[x][8];
                itemLine[4] = today;
                report.push(itemLine);
            }
        }
    }
    return report;
}

//////////////////////////////
// Update Parts List
exports.partList = (data, callback) => {
    //console.log(Object.keys(data));
    let parts = data.split(/\n(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(line => {
        return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(text => {
            return text.replace(/^"(.*)"$/, '$1');
        });
    });

    callback(addParts(parts));
}


const addParts = (partsToAdd) => {
    let partsList = [];
    partsToAdd.forEach(row => {
        if (row[0] !== "PartNumber" && row[0] !== "") {
            let partObj = {
                part_number: row[0],
                part_description: row[1],
                part_detail: row[2],
                uom: row[3],
                part_type: row[5],
                active: row[6],
                abc_code: row[7],
                weight: row[8],
                weight_uom: row[9],
                width: row[10],
                height: row[11],
                length: row[12],
                size_uom: row[13],
                primary_tracking: row[14],
                tracks_lot_number: row[18],
                tracks_serial_number: row[19],
                tracks_asset_tag: row[20],
                tracks_condition: row[21],
                tracks_brang: row[22],
                cf_mpn: row[23],
                cf_max_spec_needed: row[24],
                cf_integration_manual_needed: row[25],
                cf_raid_image_needed: row[26],
                cf_cpu_type: row[27],
                cf_processor: row[28],
                cf_cpu_base_frequency: row[29],
                cf_screen_size: row[30],
                cf_display_type: row[31],
                cf_display_long_form: row[32],
                cf_screen_resolution: row[33],
                cf_touchscreen: row[34],
                cf_ips: row[35],
                cf_120hz: row[36],
                cf_144hz: row[37],
                cf_240hz: row[38],
                cf_5ms_response_time: row[39],
                cf_3ms_response_time: row[40],
                cf_g_sync: row[41],
                cf_graphics_card: row[42],
                cf_vram: row[43],
                cf_vr_ready: row[44],
                cf_ram_size: row[45],
                cf_ram_type: row[46],
                cf_ram_speed: row[47],
                cf_max_ram_capability: row[48],
                cf_ssd: row[49],
                cf_ssd_type: row[50],
                cf_raid: row[51],
                cf_hdd: row[52],
                cf_hdd_speed_rpm: row[53],
                cf_optical_drive: row[54],
                cf_operating_system: row[55],
                cf_wireless: row[56],
                cf_wifi_brand: row[57],
                cf_bluetooth: row[58],
                cf_usb_ports: row[59],
                cf_usb_type_c: row[60],
                cf_video_ports: row[61],
                cf_thunderbolt: row[62],
                cf_audio_ports: row[63],
                cf_card_reader: row[64],
                cf_keyboard: row[65],
                cf_backlit_keyboard: row[66],
                cf_fingerprint_reader: row[67],
                cf_webcam: row[68],
                cf_battery: row[69],
                cf_power_supply: row[70],
                cf_item_length: row[71],
                cf_item_width: row[72],
                cf_item_height: row[73],
                cf_item_weight: row[74],
            }
            partsList.push(partObj);
        }
    })
    return partsList;
}