'use strict'

const logger = require("../logger/logger.js")
const client = require('./config.js')


const tagHelloSchema = {
    extenderId: '*',
    subMessageType: '*',
    result: '*',
};

const fieldHelloSchema = {
    count: 'i'
};

client.schema('system', fieldHelloSchema, tagHelloSchema, {
    stripUnknown: false,
});

function writeSystemSetServerResponse (frame){
    client.write('system')
        .tag({
            extenderId: frame.fields.header.extenderId,
            subMessageType: frame.fields.header.subMessageType,
            result: (frame.fields.data.result == '1') ? '1' : '0',
        })
        .field({
            count: 1
        })
        .then(() => logger.debug("Influx writeSystemSetResponse() successful "+frame.buffer().toString('hex').toUpperCase()))
        .catch(function(err){
            logger.error(err, "Influx writeSystemSetResponse() Failed "+frame.buffer().toString('hex').toUpperCase());
        });
}

module.exports = {
    writeSystemSetServerResponse
}
