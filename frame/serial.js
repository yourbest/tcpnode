'use strict';

const Struct = require('struct');
const Common = require('./common.js');

/**
 11- 1	:	Serial Write
 11- 2	:	Serial Write & Read
 */

const RequestSerialWriteData = Struct()
    .chars('reservedField', 2)         //2
    .word8Ube('port') //1
    .chars('flag', 1, 'hex')  //1 (00h : don't care)
    .word16Ube('uart1')   //2
    .chars('uart2', 1, 'hex')  //1 (00h : don't care)
    .chars('uart3', 1, 'hex')  //1 (00h : don't care)
    .chars('uart4', 1, 'hex')  //1 (00h : don't care)
    .chars('uart5', 1, 'hex')  //1 (00h : don't care)
    .word16Ube('dataLength')   //2
    .chars('data', 200);  //200 (00h : don't care)

const ResponseSerialWriteData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9); //10

const RequestSerialWriteReadData = Struct()
    .chars('reservedField', 2)         //2
    .word8Ube('port') //1
    .chars('flag', 1, 'hex')  //1 (00h : don't care)
    .word16Ube('uart1')   //2
    .chars('uart2', 1, 'hex')  //1 (00h : don't care)
    .chars('uart3', 1, 'hex')  //1 (00h : don't care)
    .chars('uart4', 1, 'hex')  //1 (00h : don't care)
    .chars('uart5', 1, 'hex')  //1 (00h : don't care)
    .word16Ube('dataLength')   //1
    .chars('data', 200);  //200 (00h : don't care)

const ResponseSerialWriteReadData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : timeout)
    .chars('reservedField', 3) //10
    .word16Ube('dataLength')   //2
    .chars('data', 32);  //MAX 32//TODO 가변길이라 실시간으로 생성해야 함. (ex : makeResponseSerialWriteReadData(datalength) return struct

// for Hello ----------------------------------------- //
const RequestSerialWrite = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestSerialWriteData)
    .struct('tail', Common.Tail);

const ResponseSerialWrite = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseSerialWriteData)
    .struct('tail', Common.Tail);

const RequestSerialWriteRead = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestSerialWriteReadData)
    .struct('tail', Common.Tail);

const ResponseSerialWriteRead = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseSerialWriteReadData)
    .struct('tail', Common.Tail);


module.exports = {
    RequestSerialWriteData,
    ResponseSerialWriteData,
    RequestSerialWriteReadData,
    ResponseSerialWriteReadData,
    RequestSerialWrite,
    ResponseSerialWrite,
    RequestSerialWriteRead,
    ResponseSerialWriteRead
}