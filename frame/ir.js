'use strict';

const Struct = require('struct');
const Common = require('./common.js');

/**
 10-	1	:	IR Write
 10-	2	:	IR Repeat-Start
 10-	3	:	IR Repeat-Continue
 10-	4	:	IR Repeat-Stop
 */

const RequestIrWriteData = Struct()
    .chars('reservedField', 2) //2 TODO hex '0'으로 채워지는지 확인해야 함.
    .word8Ube('port') //1
    .chars('flag', 1, 'hex')  //1 (00h : don't care)
    .chars('irData', 360);  //360

const ResponseIrWriteData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9);    //9

const RequestIrRepeatStartData = Struct()
    .chars('reservedField', 2) //2 TODO hex '0'으로 채워지는지 확인해야 함.
    .word8Ube('port') //1
    .chars('flag', 1, 'hex')  //1 (00h : don't care)
    .chars('irData', 360);  //360

const ResponseIrRepeatStartData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9);    //9

const RequestIrRepeatContinueData = Struct()
    .chars('reservedField', 10);    //10

const ResponseIrRepeatContinueData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9);    //9

const RequestIrRepeatStopData = Struct()
    .chars('reservedField', 10);    //10

const ResponseIrRepeatStopData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9);    //9

// for IR ----------------------------------------- //
const RequestIrWrite = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestIrWriteData)
    .struct('tail', Common.Tail);

const ResponseIrWrite = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseIrWriteData)
    .struct('tail', Common.Tail);

const RequestIrRepeatStart = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestIrRepeatStartData)
    .struct('tail', Common.Tail);

const ResponseIrRepeatStart = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseIrRepeatStartData)
    .struct('tail', Common.Tail);

const RequestIrRepeatContinue = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestIrRepeatContinueData)
    .struct('tail', Common.Tail);

const ResponseIrRepeatContinue = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseIrRepeatContinueData)
    .struct('tail', Common.Tail);

const RequestIrRepeatStop = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestIrRepeatStopData)
    .struct('tail', Common.Tail);

const ResponseIrRepeatStop = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseIrRepeatStopData)
    .struct('tail', Common.Tail);

module.exports = {
    RequestIrWriteData,
    ResponseIrWriteData,
    RequestIrRepeatStartData,
    ResponseIrRepeatStartData,
    RequestIrRepeatContinueData,
    ResponseIrRepeatContinueData,
    RequestIrRepeatStopData,
    ResponseIrRepeatStopData,
    RequestIrWrite,
    ResponseIrWrite,
    RequestIrRepeatStart,
    ResponseIrRepeatStart,
    RequestIrRepeatContinue,
    ResponseIrRepeatContinue,
    RequestIrRepeatStop,
    ResponseIrRepeatStop
}