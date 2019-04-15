'use strict';

const logger = require("../logger/logger.js")
const frame = require('../frame')

const requestHello = function (socket){
    let reqHello = frame.Hello.RequestHello.allocate();
    reqHello.fields.header.startCode = '84';
    reqHello.fields.header.functionCode = '01';
    reqHello.fields.header.exptenderId = 0;
    reqHello.fields.header.messageType = 1;
    reqHello.fields.header.subMessageType = 1;
    reqHello.fields.data.signature = 'HELO'
    reqHello.fields.tail.endCode = '85';
    reqHello.fields.header.dataLength = reqHello.get('data').length();
    logger.debug("Hello Request => "+reqHello.buffer().toString('hex').toUpperCase())
    socket.write(reqHello.buffer())
    // return reqHello;
}


const responseHello = function (header, bufData){
    let resHello = frame.Hello.ResponseHello.allocate();
    resHello._setBuff(bufData);
    //mac (6C2995867F27) => (36 43 32 39 39 35 38 36 37 46 32 37 )
    logger.debug("Hello Response => "+resHello.buffer().toString('hex').toUpperCase())
    logger.debug("Hello Response data size => "+resHello.fields.header.dataLength + " ==> "+ resHello.get('data').length())


    // sendHello.fields.header.startCode = '84';
    // sendHello.fields.header.functionCode = '01';
    // sendHello.fields.header.exptenderId = 0;
    // sendHello.fields.header.messageType = 1;
    // sendHello.fields.header.subMessageType = 1;
    // sendHello.fields.data.signature = 'HELO'
    // sendHello.fields.tail.endCode = '85';
    // sendHello.fields.header.dataLength = sendHello.get('data').length();
    // return resHello;
    // DB 저장
}

module.exports = {
    requestHello,
    responseHello
};