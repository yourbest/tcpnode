'use strict';

const Struct = require('struct');
const Common = require('./common.js');

/**
 10-	1	:	IR Write
 10-	2	:	IR Repeat-Start
 10-	3	:	IR Repeat-Continue
 10-	4	:	IR Repeat-Stop
 */

const ReqestIrWriteData = Struct()
    .word16Ube('reservedField') //2
    .word8Ube('port') //1
    .chars('flag', 1, 'hex')  //1 (00h : don't care)
    .chars('irData', 360);  //360

const ResponseIrWriteData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9);    //9

const ReqestIrRepeatStartData = Struct()
    .word16Ube('reservedField') //2
    .word8Ube('port') //1
    .chars('flag', 1, 'hex')  //1 (00h : don't care)
    .chars('irData', 360);  //360

const ResponseIrRepeatStartData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9);    //9

const ReqestIrRepeatContinueData = Struct()
    .chars('reservedField', 10);    //10

const ResponseIrRepeatContinueData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9);    //9

const ReqestIrRepeatStopData = Struct()
    .chars('reservedField', 10);    //10

const ResponseIrRepeatStopData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9);    //9

// for IR ----------------------------------------- //
const ReqestIrWrite = Struct()
    .struct('header', Common.Header)
    .struct('data', ReqestIrWriteData)
    .struct('tail', Common.Tail);

const ResponseIrWrite = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseIrWriteData)
    .struct('tail', Common.Tail);

const ReqestIrRepeatStart = Struct()
    .struct('header', Common.Header)
    .struct('data', ReqestIrRepeatStartData)
    .struct('tail', Common.Tail);

const ResponseIrRepeatStart = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseIrRepeatStartData)
    .struct('tail', Common.Tail);

const ReqestIrRepeatContinue = Struct()
    .struct('header', Common.Header)
    .struct('data', ReqestIrRepeatContinueData)
    .struct('tail', Common.Tail);

const ResponseIrRepeatContinue = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseIrRepeatContinueData)
    .struct('tail', Common.Tail);

const ReqestIrRepeatStop = Struct()
    .struct('header', Common.Header)
    .struct('data', ReqestIrRepeatStopData)
    .struct('tail', Common.Tail);

const ResponseIrRepeatStop = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseIrRepeatStopData)
    .struct('tail', Common.Tail);

module.exports = {
    ReqestIrWriteData,
    ResponseIrWriteData,
    ReqestIrRepeatStartData,
    ResponseIrRepeatStartData,
    ReqestIrRepeatContinueData,
    ResponseIrRepeatContinueData,
    ReqestIrRepeatStopData,
    ResponseIrRepeatStopData,
    ReqestIrWrite,
    ResponseIrWrite,
    ReqestIrRepeatStart,
    ResponseIrRepeatStart,
    ReqestIrRepeatContinue,
    ResponseIrRepeatContinue,
    ReqestIrRepeatStop,
    ResponseIrRepeatStop
}