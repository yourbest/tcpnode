'use strict'

const logger = require("../logger/logger.js")
const client = require('./config.js')


const tagDigitalSchema = {
    extenderId: '*',
    subMessageType: '*',
};

const fieldDigitalSchema = {
    di1Status: 'i',
    di2Status: 'i',
    di3Status: 'i',
};

client.schema('digital', fieldDigitalSchema, tagDigitalSchema, {
    stripUnknown: false,
});

function writeDigitalGetStatusResponse (frame){
    client.write('digital')
        .tag({
            extenderId: frame.fields.header.extenderId,
            subMessageType: frame.fields.header.subMessageType,
        })
        .field({
            di1Status: frame.fields.data.di1Status,
            di2Status: frame.fields.data.di2Status,
        })
        .then(() => logger.debug("Influx writeDigitalGetStatusResponse() successful "+frame.buffer().toString('hex').toUpperCase()))
        .catch(function(err){
            logger.error(err, "Influx writeDigitalGetStatusResponse() Failed "+frame.buffer().toString('hex').toUpperCase());
        });
}

module.exports = {
    writeDigitalGetStatusResponse
}
