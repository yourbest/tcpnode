'use strict';

const Struct = require('struct');

const SendHelloData = Struct()
    .chars('signature', 4)
    .chars('reservedField', 6);

const ResponseHelloData = Struct()
    .chars('signature', 6)              //6
    .word8Sle('firmwareMajorVersion')   //1
    .word8Sle('firmwareMinorVersion')   //1
    .chars('macAddress', 12)            //12
    .word16Sle('extenderId')            //2
    .chars('reservedField', 8);         //8

module.exports = {
    SendHelloData,
    ResponseHelloData
}