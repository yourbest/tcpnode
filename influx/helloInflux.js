'use strict'

const logger = require("../logger/logger.js")
const client = require('./config.js')


const tagHelloSchema = {
    extenderId: '*',
    subMessageType: '*',
    signature: '*',
    firmwareMajorVersion: '*',
    firmwareMinorVersion: '*',
    macAddress: '*'
};

const fieldHelloSchema = {
    count: 'i'
};

client.schema('hello', fieldHelloSchema, tagHelloSchema, {
    stripUnknown: false,
});

function writeHelloResponse (frame){
    client.write('hello')
        .tag({
            extenderId: frame.fields.header.extenderId,
            subMessageType: frame.fields.header.subMessageType,
            signature: frame.fields.data.signature,
            firmwareMajorVersion: frame.fields.data.firmwareMajorVersion,
            firmwareMinorVersion: frame.fields.data.firmwareMinorVersion,
            macAddress: frame.fields.data.macAddress
        })
        .field({
            count: 1
        })
        // .then(() => logger.debug("Influx writeHelloResponse() successful "+frame.buffer().toString('hex').toUpperCase()))
        .then(() => {
            // logger.debug("Influx writeHelloResponse() successful "+frame.buffer().toString('hex').toUpperCase());
            return frame;
        }, (err)=>{
            return err;
        })
        .catch(function(err){
            logger.error(err, "Influx writeHelloResponse() Failed "+frame.buffer().toString('hex').toUpperCase());
        });
}

module.exports = {
    writeHelloResponse
}
