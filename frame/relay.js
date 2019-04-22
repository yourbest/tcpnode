'use strict';

const Struct = require('struct');
const Common = require('./common.js');

const RequestRelayData = Struct()
    .chars('reservedField', 2)          //2
    .chars('port', 4) //32bit로 구성 --> 일단 Binary로 포트 구성한 후 다시 Hex로 변환해야 함 (01110110 이런식)
    .chars('flag', 1, 'hex')            //1
    .word16Ube('delay');                //2

const ResponseRelayData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9); //10

// for Relay ----------------------------------------- //
const RequestRelay = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestRelayData)
    .struct('tail', Common.Tail);

const ResponseRelay = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseRelayData)
    .struct('tail', Common.Tail);

module.exports = {
    RequestRelayData,
    ResponseRelayData,
    RequestRelay,
    ResponseRelay
}