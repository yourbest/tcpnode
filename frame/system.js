'use strict';

const Struct = require('struct');
const Common = require('./common.js');

// const RequestSystemRebootData = Struct()
//     .chars('reservedField', 10);
//
// const RequestSystemGetIpPortData = Struct()
//     .chars('reservedField', 10);

const RequestSystemSetIpPortData = Struct()
    .word8Ube('ipLength')   //1
    .chars('serverIp', 15)  //15
    .word8Ube('portLength') //1
    .chars('serverPort', 5) //5
    .chars('reservedField', 8);    //10

// const ResponseSystemGetIpPortData = Struct()
//     .word8Ube('ipLength')   //1
//     .chars('serverIp', 15)  //15
//     .word8Ube('portLength') //1
//     .chars('serverPort', 5) //15
//     .chars('reservedField', 6);    //10

const ResponseSystemSetData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9); //10

// for System ----------------------------------------- //
// const RequestSystemReboot = Struct()
//     .struct('header', Common.Header)
//     .struct('data', RequestSystemRebootData)
//     .struct('tail', Common.Tail);
//
// const RequestSystemGetIpPort = Struct()
//     .struct('header', Common.Header)
//     .struct('data', RequestSystemGetIpPortData)
//     .struct('tail', Common.Tail);

const RequestSystemSetIpPort = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestSystemSetIpPortData)
    .struct('tail', Common.Tail);

const ResponseSystemSet = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseSystemSetData)
    .struct('tail', Common.Tail);

module.exports = {
    // RequestSystemRebootData,
    // RequestSystemGetIpPortData,
    RequestSystemSetIpPortData,
    ResponseSystemSetData,
    // RequestSystemReboot,
    // RequestSystemGetIpPort,
    RequestSystemSetIpPort,
    ResponseSystemSet
}