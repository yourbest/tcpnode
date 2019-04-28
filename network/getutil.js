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

module.exports{
    getServerIp
}

