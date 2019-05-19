'use strict';

const logger = require("../logger/logger.js")
let frame = require('../frame')
let influxDigital = require('../influx/digitalInflux.js');
let influxCurrent = require('../influx/currentInflux.js');

const responseNotifyStatusWorker = function (socket, extenderId, subMessageType){
    let resNotify = frame.Notify.ResponseNotify.allocate();
    resNotify.fields.header.startCode = '84';
    resNotify.fields.header.functionCode = '02';//01h, 02h
    resNotify.fields.header.extenderId = extenderId;
    resNotify.fields.header.messageType = 100;
    resNotify.fields.header.subMessageType = subMessageType;

    //Result
    resNotify.fields.data.result = '01';

    resNotify.fields.tail.endCode = '85';
    resNotify.fields.header.dataLength = resNotify.get('data').length();
    console.log(resNotify.buffer());
    logger.debug("Notify responseNotifyStatusWorker => "+resNotify.buffer().toString('hex').toUpperCase())
    socket.write(resNotify.buffer())
    // return reqHello;
}

const pushNotifyDiStatusWorker = function (header, bufData){
    let resResult = frame.Notify.PushNotifyDiStatus.allocate();
    resResult._setBuff(bufData);

    logger.info("pushNotifyDiStatusWorker => "+resResult.buffer().toString('hex').toUpperCase())
    // logger.debug("pushNotifyDiStatusWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    logger.info("pushNotifyDiStatusWorker return : "+ JSON.stringify(resResult.fields.data));
    influxDigital.writeDigitalGetStatusResponse(resResult);

    return resResult.fields.data.result;
}

const pushNotifyCurrentStatusWorker = function (header, bufData){
    let resResult = frame.Notify.PushNotifyCurrentStatus.allocate();
    resResult._setBuff(bufData);

    logger.info("pushNotifyCurrentStatusWorker => "+resResult.buffer().toString('hex').toUpperCase())
    // logger.debug("pushNotifyCurrentStatusWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    logger.info("pushNotifyCurrentStatusWorker return : "+ JSON.stringify(resResult.fields.data));
    influxCurrent.writeCurrentGetStatusResponse(resResult);

    return resResult.fields.data.result;
}



module.exports = {
    responseNotifyStatusWorker,
    pushNotifyDiStatusWorker,
    pushNotifyCurrentStatusWorker,
}