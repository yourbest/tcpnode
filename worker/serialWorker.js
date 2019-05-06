'use strict';

const logger = require("../logger/logger.js")
const frame = require('../frame')
const influx = require('../influx/serialInflux.js');

const requestSerialWriteWorker = function (socket, extenderId, port, uart1, uart2, uart3, uart4, uart5, data){
    let reqSerial = frame.Serial.RequestSerialWrite.allocate();
    reqSerial.fields.header.startCode = '84';
    reqSerial.fields.header.functionCode = '01';//01h, 02h
    reqSerial.fields.header.extenderId = extenderId;
    reqSerial.fields.header.messageType = 11;
    reqSerial.fields.header.subMessageType = 1;

    reqSerial.fields.data.port = port;
    reqSerial.fields.data.uart1 = uart1;
    reqSerial.fields.data.uart2 = uart2;
    reqSerial.fields.data.uart3 = uart3;
    reqSerial.fields.data.uart4 = uart4;
    reqSerial.fields.data.uart5 = uart5;
    reqSerial.fields.data.data = data;
    reqSerial.fields.data.dataLength = data.length;

    reqSerial.fields.tail.endCode = '85';
    reqSerial.fields.header.dataLength = reqSerial.get('data').length();
    logger.debug("System requestSerialWriteWorker => "+reqSerial.buffer().toString('hex').toUpperCase())
    socket.write(reqSerial.buffer())
    // return reqHello;
}


const responseSerialWriteWorker = function (header, bufData){
    let resResult = frame.Serial.ResponseSerialWrite.allocate();
    resResult._setBuff(bufData);

    logger.info("responseSerialWriteWorker Response => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("responseSerialWriteWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    // influx.writeSystemSetServerResponse(resResult);
    //TODO 이력을 모두 저정해야 할까?
    return resResult.fields.data.result;
}

const requestSerialWriteReadWorker = function (socket, extenderId, port, uart1, uart2, uart3, uart4, uart5, data){
    let reqSerial = frame.Serial.RequestSerialWrite.allocate();
    reqSerial.fields.header.startCode = '84';
    reqSerial.fields.header.functionCode = '01';//01h, 02h
    reqSerial.fields.header.extenderId = extenderId;
    reqSerial.fields.header.messageType = 11;
    reqSerial.fields.header.subMessageType = 2;

    reqSerial.fields.data.port = port;
    reqSerial.fields.data.uart1 = uart1;
    reqSerial.fields.data.uart2 = uart2;
    reqSerial.fields.data.uart3 = uart3;
    reqSerial.fields.data.uart4 = uart4;
    reqSerial.fields.data.uart5 = uart5;
    reqSerial.fields.data.data = data;
    reqSerial.fields.data.dataLength = data.length;

    reqSerial.fields.tail.endCode = '85';
    reqSerial.fields.header.dataLength = reqSerial.get('data').length();
    logger.debug("System requestSerialWriteReadWorker => "+reqSerial.buffer().toString('hex').toUpperCase())
    socket.write(reqSerial.buffer())
    // return reqHello;
}

const responseSerialWriteReadWorker = function (header, bufData){
    let resResult = frame.Serial.ResponseSerialWrite.allocate();
    resResult._setBuff(bufData);

    logger.info("responseSerialWriteWorker Response => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("responseSerialWriteWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    // influx.writeSystemSetServerResponse(resResult);
    //TODO 세팅한 이력을 모두 저정해야 할까?
    return {
        'result': resResult.fields.data.result,
        'dataLength' : resResult.fields.data.dataLength,
        'data' : (resResult.fields.data.dataLength).substring(0,resResult.fields.data.dataLength),
    };
}

module.exports = {
    requestSerialWriteWorker,
    responseSerialWriteWorker,
    requestSerialWriteReadWorker,
    responseSerialWriteReadWorker,
}