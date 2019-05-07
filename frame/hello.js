'use strict';

const Struct = require('struct');
const Common = require('./common.js');

const RequestHelloData = Struct()
    .chars('signature', 4)
    .chars('reservedField', 6);

const ResponseHelloData = Struct()
    .chars('signature', 6)              //6
    .chars('firmwareMajorVersion', 1)   //1
    .chars('firmwareMinorVersion', 1)   //1
    .chars('macAddress', 12)            //12
    .word16Ube('extenderId')            //2
    .chars('reservedField', 8);         //8


// for Hello ----------------------------------------- //
const RequestHello = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestHelloData)
    .struct('tail', Common.Tail);

const ResponseHello = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseHelloData)
    .struct('tail', Common.Tail);

module.exports = {
    RequestHelloData,
    ResponseHelloData,
    RequestHello,
    ResponseHello
}