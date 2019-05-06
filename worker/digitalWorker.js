'use strict';

const logger = require("../logger/logger.js")
const frame = require('../frame')
const influx = require('../influx/digitalInflux.js');

const requestDigitalGetStatusWorker = function (socket, extenderId){
    let reqDigital = frame.Digital.RequestDigitalGetStatus.allocate();
    reqDigital.fields.header.startCode = '84';
    reqDigital.fields.header.functionCode = '01';//01h, 02h
    reqDigital.fields.header.extenderId = extenderId;
    reqDigital.fields.header.messageType = 14;
    reqDigital.fields.header.subMessageType = 3;

    //No Data Field

    reqDigital.fields.tail.endCode = '85';
    reqDigital.fields.header.dataLength = reqDigital.get('data').length();
    logger.debug("System requestDigitalGetStatusWorker => "+reqDigital.buffer().toString('hex').toUpperCase())
    socket.write(reqDigital.buffer())
    // return reqHello;
}

const responseDigitalGetStatusWorker = function (header, bufData){
    let resResult = frame.Digital.ResponseDigitalGetStatus.allocate();
    resResult._setBuff(bufData);

    logger.info("responseDigitalGetStatusWorker Response => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("responseDigitalGetStatusWorker data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // Result 저장
    influx.writeDigitalGetStatusResponse(resResult);

    return resResult.fields.data.result;
}

module.exports = {
    requestDigitalGetStatusWorker,
    responseDigitalGetStatusWorker,
}