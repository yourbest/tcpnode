'use strict';

const Struct = require('struct');
const Common = require('./common.js');

/**

 */

const PushNotifyDiStatusData = Struct()
    .chars('di1Status', 1, 'hex')  //1 (00h : rising, 01h : falling)
    .chars('di2Status', 1, 'hex')  //1 (00h : rising, 01h : falling)
    .chars('di3Status', 1, 'hex');  //1 (00h : rising, 01h : falling)

const PushNotifyCurrentStatusData = Struct()
    .word16Ube('ch1Current')         //0~65535mA
    .word8Ube('ch1Status')         //step 1, 2, 3
    .word16Ube('ch2Current')         //0~65535mA
    .word8Ube('ch2Status');         //step 1, 2, 3

const ResponseNotifyData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9); //9

// for Notify ----------------------------------------- //
const PushNotifyDiStatus = Struct()
    .struct('header', Common.Header)
    .struct('data', PushNotifyDiStatusData)
    .struct('tail', Common.Tail);

const PushNotifyCurrentStatus = Struct()
    .struct('header', Common.Header)
    .struct('data', PushNotifyCurrentStatusData)
    .struct('tail', Common.Tail);

const ResponseNotify = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseNotifyData)
    .struct('tail', Common.Tail);

module.exports = {
    PushNotifyDiStatusData,
    PushNotifyCurrentStatusData,
    ResponseNotifyData,
    PushNotifyDiStatus,
    PushNotifyCurrentStatus,
    ResponseNotify,
}