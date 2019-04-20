'use strict';

const Struct = require('struct');
const Common = require('./common.js');

const ReqestSystemRebootData = Struct()
    .chars('reservedField', 10);

const ReqestSystemGetIpPortData = Struct()
    .chars('reservedField', 10);

const ReqestSystemSetIpPortData = Struct()
    .word8Ube('ipLength')   //1
    .chars('serverIp', 15)  //15
    .word8Ube('portLength') //1
    .chars('serverPort', 5) //5
    .chars('reservedField', 8);    //10

const ResponseSystemGetIpPortData = Struct()
    .word8Ube('ipLength')   //1
    .chars('serverIp', 15)  //15
    .word8Ube('portLength') //1
    .chars('serverPort', 5) //15
    .chars('reservedField', 6);    //10

const ResponseSystemSetData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9); //10

// for System ----------------------------------------- //
const RequestSystemReboot = Struct()
    .struct('header', Common.Header)
    .struct('data', ReqestSystemRebootData)
    .struct('tail', Common.Tail);

const RequestSystemGetIpPort = Struct()
    .struct('header', Common.Header)
    .struct('data', ReqestSystemGetIpPortData)
    .struct('tail', Common.Tail);

const ReqestSystemSetIpPort = Struct()
    .struct('header', Common.Header)
    .struct('data', ReqestSystemSetIpPortData)
    .struct('tail', Common.Tail);

const ResponseSystemSet = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseSystemSetData)
    .struct('tail', Common.Tail);

module.exports = {
    RequestSystemRebootData,
    RequestSystemGetIpPortData,
    ReqestSystemSetIpPortData,
    ResponseSystemSetData,
    RequestSystemReboot,
    RequestSystemGetIpPort,
    ReqestSystemSetIpPort,
    ResponseSystemSet
}