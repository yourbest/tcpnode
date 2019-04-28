'use strict';

const logger = require("../logger/logger.js")
const frame = require('../frame')
const influx = require('../influx/systemInflux.js');

const RequestSystemSetIpPort = function (socket, extenderId, serverIp, serverPort){
    let reqSystem = frame.System.RequestSystemSetIpPort.allocate();
    reqSystem.fields.header.startCode = '84';
    reqSystem.fields.header.functionCode = '01';//01h, 02h
    reqSystem.fields.header.extenderId = extenderId;
    reqSystem.fields.header.messageType = 2;
    reqSystem.fields.header.subMessageType = 4;

    reqSystem.fields.data.ipLength = serverIp.trim().length;
    reqSystem.fields.data.serverIp = serverIp;
    reqSystem.fields.data.ipLength = serverPort.length;
    reqSystem.fields.data.serverPort = serverPort;

    reqSystem.fields.tail.endCode = '85';
    reqSystem.fields.header.dataLength = reqSystem.get('data').length();
    logger.debug("(Test) System RequestSystemSetIpPort => "+reqSystem.buffer().toString('hex').toUpperCase())
    socket.write(reqSystem.buffer())
    // return reqHello;
}


const ResponseSystemSetData = function (header, bufData){
    let resResult = frame.System.ResponseSystemSet.allocate();
    resResult._setBuff(bufData);

    logger.info("ResponseSystemSetData Response => "+resResult.buffer().toString('hex').toUpperCase())
    logger.debug("Hello Response data size => "+resResult.fields.header.dataLength + " == "+ resResult.get('data').length())

    // DB 저장
    influx.writeSystemSetResponse(resResult);
}

module.exports = {
    RequestSystemSetIpPort,
    ResponseSystemSetData
}