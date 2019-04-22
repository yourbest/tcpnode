'use strict';

const Struct = require('struct');
const Common = require('./common.js');

const DigitalRelayOut = Struct()
    .word8Ube('type')          //NU(0), NC(1), NO(2), Trigger NC(3), Trigger NO(4)
    .word16Ube('delay')          //0~65535 ms
    .chars('reservedField', 2); //2

const RequestDigitalSetRelayOutData = Struct()
    .struct('di1RisingCh1', DigitalRelayOut)          //5
    .struct('di1FallingCh1', DigitalRelayOut)          //5
    .struct('di1RisingCh2', DigitalRelayOut)          //5
    .struct('di1FallingCh2', DigitalRelayOut)          //5
    .struct('di1RisingCh3', DigitalRelayOut)          //5
    .struct('di1FallingCh3', DigitalRelayOut)          //5
    .struct('di2RisingCh1', DigitalRelayOut)          //5
    .struct('di2FallingCh1', DigitalRelayOut)          //5
    .struct('di2RisingCh2', DigitalRelayOut)          //5
    .struct('di2FallingCh2', DigitalRelayOut)          //5
    .struct('di2RisingCh3', DigitalRelayOut)          //5
    .struct('di2FallingCh3', DigitalRelayOut)          //5
    .struct('di3RisingCh1', DigitalRelayOut)          //5
    .struct('di3FallingCh1', DigitalRelayOut)          //5
    .struct('di3RisingCh2', DigitalRelayOut)          //5
    .struct('di3FallingCh2', DigitalRelayOut)          //5
    .struct('di3RisingCh3', DigitalRelayOut)          //5
    .struct('di3FallingCh3', DigitalRelayOut);          //5

const ResponseDigitalSetRelayOutData = Struct()
    .struct('di1RisingCh1', DigitalRelayOut)          //5
    .struct('di1FallingCh1', DigitalRelayOut)          //5
    .struct('di1RisingCh2', DigitalRelayOut)          //5
    .struct('di1FallingCh2', DigitalRelayOut)          //5
    .struct('di1RisingCh3', DigitalRelayOut)          //5
    .struct('di1FallingCh3', DigitalRelayOut)          //5
    .struct('di2RisingCh1', DigitalRelayOut)          //5
    .struct('di2FallingCh1', DigitalRelayOut)          //5
    .struct('di2RisingCh2', DigitalRelayOut)          //5
    .struct('di2FallingCh2', DigitalRelayOut)          //5
    .struct('di2RisingCh3', DigitalRelayOut)          //5
    .struct('di2FallingCh3', DigitalRelayOut)          //5
    .struct('di3RisingCh1', DigitalRelayOut)          //5
    .struct('di3FallingCh1', DigitalRelayOut)          //5
    .struct('di3RisingCh2', DigitalRelayOut)          //5
    .struct('di3FallingCh2', DigitalRelayOut)          //5
    .struct('di3RisingCh3', DigitalRelayOut)          //5
    .struct('di3FallingCh3', DigitalRelayOut);          //5

const RequestDigitalGetStatusData = Struct()
    .chars('reservedField', 10); //10

const ResponseDigitalGetStatusData = Struct()
    .chars('di1Status', 1, 'hex') //0x00	Rising, 0x01	Falling
    .chars('di2Status', 1, 'hex') //0x00	Rising, 0x01	Falling
    .chars('di3Status', 1, 'hex') //0x00	Rising, 0x01	Falling

// for Digital Input ----------------------------------------- //
const RequestDigitalSetRelayOut = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestDigitalSetRelayOutData)
    .struct('tail', Common.Tail);

const ResponseDigitalSetRelayOut = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseDigitalSetRelayOutData)
    .struct('tail', Common.Tail);

const RequestDigitalGetStatus = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestDigitalGetStatusData)
    .struct('tail', Common.Tail);

const ResponseDigitalGetStatus = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseDigitalGetStatusData)
    .struct('tail', Common.Tail);

module.exports = {
    RequestDigitalSetRelayOutData,
    ResponseDigitalSetRelayOutData,
    RequestDigitalGetStatusData,
    ResponseDigitalGetStatusData,
    RequestDigitalSetRelayOut,
    ResponseDigitalSetRelayOut,
    RequestDigitalGetStatus,
    ResponseDigitalGetStatus,
}