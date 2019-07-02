'use strict'

const os = require('os');

function getServerIp() {
    let ifaces = os.networkInterfaces();
    let result = '';
    for (let dev in ifaces) {
        let alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
            }
        });
    }
    // console.log(getServerIp());
    return result;
}

function genHelloRequestData(extenderId) {
    // 8401 0001 0D03001A 00000000000000000000 85
    // 8401 0001 0101000A 48454C4F000000000000 85
    let bufHeader = Buffer.from("8401", 'hex');
    let bufExtenderId = Buffer.alloc(2);
    bufExtenderId.writeUInt16BE(extenderId);
    let bufTail = Buffer.from("0101000A48454C4F00000000000085", 'hex');
    return Buffer.concat([bufHeader, bufExtenderId, bufTail]);
}

function genGetCurrentStatusData(extenderId) {
    // 8401 0001 0D03001A 00000000000000000000 85
    let bufHeader = Buffer.from("8401", 'hex');
    let bufExtenderId = Buffer.alloc(2);
    bufExtenderId.writeUInt16BE(extenderId);
    let bufTail = Buffer.from("0D03000A0000000000000000000085", 'hex');
    return Buffer.concat([bufHeader, bufExtenderId, bufTail]);
}


function genGetDigitalStatusData(extenderId) {
    // 8401 0001 0E03000A 00000000000000000000 85
    let bufHeader = Buffer.from("8401", 'hex');
    let bufExtenderId = Buffer.alloc(2);
    bufExtenderId.writeUInt16BE(extenderId);
    let bufTail = Buffer.from("0E03000A0000000000000000000085", 'hex');
    return Buffer.concat([bufHeader, bufExtenderId, bufTail]);
}

module.exports = {
    getServerIp,
    genGetCurrentStatusData,
    genGetDigitalStatusData,
    genHelloRequestData
}

