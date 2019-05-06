'use strict'

const logger = require("../logger/logger.js")
const client = require('./config.js')


const tagCurrentSchema = {
    extenderId: '*',
    subMessageType: '*',
    ch1Status: '*',
    ch2Status: '*',
};

const fieldCurrentSchema = {
    ch1Current: 'i',
    ch2Current: 'i'
};

client.schema('current', fieldCurrentSchema, tagCurrentSchema, {
    stripUnknown: false,
});

function writeCurrentGetStatusResponse (frame){
    client.write('current')
        .tag({
            extenderId: frame.fields.header.extenderId,
            subMessageType: frame.fields.header.subMessageType,
            ch1Status: frame.fields.data.ch1Status,
            ch2Status: frame.fields.data.ch2Status,
        })
        .field({
            ch1Current: frame.fields.data.ch1Current,
            ch2Current: frame.fields.data.ch2Current,
        })
        .then(() => logger.debug("Influx writeCurrentGetStatusResponse() successful "+frame.buffer().toString('hex').toUpperCase()))
        .catch(function(err){
            logger.error(err, "Influx writeCurrentGetStatusResponse() Failed "+frame.buffer().toString('hex').toUpperCase());
        });
}

module.exports = {
    writeCurrentGetStatusResponse
}
