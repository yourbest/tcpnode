'use strict';

const logger = require("../logger/logger.js")
const frame = require('../frame')
// const influx = require('../influx/serialInflux.js');

const requestSerialWriteWorker = function (socket, extenderId, port, uart1, uart2, uart3, uart4, uart5, data){
    //TODO DATA 정합성 검증 필요
    //Data Struct 마련
    let bufData = new Buffer(data, 'hex');
    let vDataFrame = Struct().chars('data', bufData.length);  //MAX 200

    let reqSerial = Struct()
        .struct('header', frame.Common.Header)
        .struct('data', frame.Serial.RequestSerialWriteReadData)
        .struct('vData', vDataFrame)
        .struct('tail', frame.Common.Tail)
        .allocate();

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
    reqSerial.fields.data.dataLength = bufData.length;

    reqSerial.fields.vData.data = data;

    reqSerial.fields.endCode = '85';

    reqSerial.fields.header.dataLength = reqSerial.get('data').length()+reqSerial.fields.data.dataLength;
    logger.debug("System requestSerialWriteWorker => "+reqSerial.buffer().toString('hex').toUpperCase());
    socket.write(reqSerial.buffer());
    // return reqHello;
}


const responseSerialWriteWorker = function (header, bufData){
    let resResult = frame.Serial.ResponseSerialWrite.allocate();
    resResult._setBuff(bufData);

    logger.info("responseSerialWriteWorker Response => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("responseSerialWriteWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    // influx.writeSystemSetServerResponse(resResult);
    logger.info("responseSerialWriteWorker return : "+ JSON.stringify(resResult.fields.data));
    //TODO 이력을 모두 저정해야 할까?
    return resResult.fields.data.result;
}

const requestSerialWriteReadWorker = function (socket, extenderId, port, uart1, uart2, uart3, uart4, uart5, data){

    //TODO DATA 정합성 검증 필요
    //Data Struct 마련
    let bufData = new Buffer(data, 'hex');
    let vDataFrame = Struct().chars('data', bufData.length);  //MAX 200

    let reqSerial = Struct()
        .struct('header', frame.Common.Header)
        .struct('data', frame.Serial.RequestSerialWriteReadData)
        .struct('vData', vDataFrame)
        .struct('tail', frame.Common.Tail)
        .allocate();

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
    reqSerial.fields.data.dataLength = bufData.length;

    reqSerial.fields.vData.data = data;

    reqSerial.fields.endCode = '85';

    reqSerial.fields.header.dataLength = reqSerial.get('data').length()+reqSerial.fields.data.dataLength;
    logger.debug("System requestSerialWriteReadWorker => "+reqSerial.buffer().toString('hex').toUpperCase());
    socket.write(reqSerial.buffer());
    // return reqHello;
}

const responseSerialWriteReadWorker = function (header, bufData){
    //TODO 실시간으로 struct 생성해야 함.
    let resResult = frame.Serial.ResponseSerialWriteRead.allocate();
    logger.debug("responseSerialWriteReadWorker resResult length="+resResult.length());
    logger.debug("responseSerialWriteReadWorker Original bufData length="+bufData.length);
    resResult._setBuff(bufData);

    logger.info("responseSerialWriteWorker Response => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("responseSerialWriteWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    // influx.writeSystemSetServerResponse(resResult);
    //TODO 세팅한 이력을 모두 저정해야 할까?
    console.log("-----------> "+ (frame.Common.Header.length() + frame.Serial.ResponseSerialWriteReadData.length()));
    let rslt = {
        'result': resResult.fields.data.result,
        'dataLength' : resResult.fields.data.dataLength,
        //'data' : bufData.slice(frame.Common.Header.length() + frame.Serial.ResponseSerialWriteReadData.length(), frame.Common.Header.length() + frame.Serial.ResponseSerialWriteReadData.length() + resResult.fields.data.dataLength).toString('hex'),
        'data' : bufData.slice(resResult.get('header').length() + resResult.get('data').length(), resResult.get('header').length() + resResult.get('data').length() + resResult.fields.data.dataLength).toString('hex'),
    };
    logger.info("responseSerialWriteWorker return : "+ JSON.stringify(rslt));
    return rslt;
}

module.exports = {
    requestSerialWriteWorker,
    responseSerialWriteWorker,
    requestSerialWriteReadWorker,
    responseSerialWriteReadWorker,
}