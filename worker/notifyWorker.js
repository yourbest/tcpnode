'use strict';

const logger = require("../logger/logger.js")
const frame = require('../frame')
const influxDigital = require('../influx/digitalInflux.js');
const influxCurrent = require('../influx/currentInflux.js');

const responseNotifyStatusWorker = function (socket, extenderId, subMessageType){
    let reqNotify = frame.Notify.ResponseNotify.allocate();
    reqNotify.fields.header.startCode = '84';
    reqNotify.fields.header.functionCode = '02';//01h, 02h
    reqNotify.fields.header.extenderId = extenderId;
    reqNotify.fields.header.messageType = 100;
    reqNotify.fields.header.subMessageType = subMessageType;

    //Result
    reqNotify.fields.data.result = 0x01;

    reqNotify.fields.tail.endCode = '85';
    reqNotify.fields.header.dataLength = reqNotify.get('data').length();
    logger.debug("System requestDigitalGetStatusWorker => "+reqNotify.buffer().toString('hex').toUpperCase())
    socket.write(reqNotify.buffer())
    // return reqHello;
}

const pushNotifyDiStatusWorker = function (header, bufData){
    let resResult = frame.Notify.PushNotifyDiStatus.allocate();
    resResult._setBuff(bufData);

    logger.info("pushNotifyDiStatusWorker => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("pushNotifyDiStatusWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    influxDigital.writeDigitalGetStatusResponse(resResult);

    return resResult.fields.data.result;
}

const pushNotifyCurrentStatusWorker = function (header, bufData){
    let resResult = frame.Notify.PushNotifyCurrentStatus.allocate();
    resResult._setBuff(bufData);

    logger.info("pushNotifyCurrentStatusWorker => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("pushNotifyCurrentStatusWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    influxCurrent.writeCurrentGetStatusResponse(resResult);

    return resResult.fields.data.result;
}



module.exports = {
    responseNotifyStatusWorker,
    pushNotifyDiStatusWorker,
    pushNotifyCurrentStatusWorker,
}