'use strict';

const logger = require("../logger/logger.js")
const frame = require('../frame')
const influx = require('../influx/currentInflux.js');

const requestCurrentGetConfigurationWorker = function (socket, extenderId){
    let reqCurrent = frame.Current.RequestCurrentGetConfiguration.allocate();
    reqCurrent.fields.header.startCode = '84';
    reqCurrent.fields.header.functionCode = '01';//01h, 02h
    reqCurrent.fields.header.extenderId = extenderId;
    reqCurrent.fields.header.messageType = 13;
    reqCurrent.fields.header.subMessageType = 2;

    //No Data Field

    reqCurrent.fields.tail.endCode = '85';
    reqCurrent.fields.header.dataLength = reqCurrent.get('data').length();
    logger.debug("System requestCurrentGetConfigurationWorker => "+reqCurrent.buffer().toString('hex').toUpperCase())
    socket.write(reqCurrent.buffer())
    // return reqHello;
    //TODO callback 사용해야 함. extender로 부터 response를 받은 후에 return 해야 함.
}
// (6) (2) (data) (1)
// 840200000D02   0011  020000007800B4004F0082009600480000   85
const responseCurrentGetConfigurationWorker = function (bufData){
    let resResult = frame.Current.ResponseCurrentGetConfiguration.allocate();
    resResult._setBuff(bufData);
    logger.info("responseCurrentWorker Response => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("responseCurrentWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    //Get Config 이력 저장 안함 (reportType, period time, ch1/ch2 setting)
    logger.info("responseCurrentGetConfigurationWorker return : "+ JSON.stringify(resResult.fields.data));
    return resResult.fields.data.result;
}

const requestCurrentGetStatusWorker = function (socket, extenderId){
    let reqCurrent = frame.Current.RequestCurrentGetStatus.allocate();
    reqCurrent.fields.header.startCode = '84';
    reqCurrent.fields.header.functionCode = '01';//01h, 02h
    reqCurrent.fields.header.extenderId = extenderId;
    reqCurrent.fields.header.messageType = 13;
    reqCurrent.fields.header.subMessageType = 3;

    //No Data Field

    reqCurrent.fields.tail.endCode = '85';
    reqCurrent.fields.header.dataLength = reqCurrent.get('data').length();
    logger.debug("System requestCurrentGetStatusWorker => "+reqCurrent.buffer().toString('hex').toUpperCase())
    socket.write(reqCurrent.buffer())
    // return reqHello;
}

// (6) (2)   (data)  (1)
// 840200000D02  0011  020000007800B4004F0082 009600480000  85
const responseCurrentGetStatusWorker = function (bufData){
    let resResult = frame.Current.ResponseCurrentGetStatus.allocate();
    resResult._setBuff(bufData);

    logger.info("responseCurrentGetStatusWorker Response => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("responseCurrentGetStatusWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    logger.info("responseCurrentGetStatusWorker return : "+ JSON.stringify(resResult.fields.data));
    influx.writeCurrentGetStatusResponse(resResult);

    return resResult.fields.data.result;
}

module.exports = {
    requestCurrentGetConfigurationWorker,
    responseCurrentGetConfigurationWorker,
    requestCurrentGetStatusWorker,
    responseCurrentGetStatusWorker,
}