'use strict';

const logger = require("../logger/logger.js")
const frame = require('../frame')
const influx = require('../influx/helloInflux.js');

const requestHelloWorker = async (socket, extenderId) => {
    let reqHello = frame.Hello.RequestHello.allocate();
    reqHello.fields.header.startCode = '84';
    reqHello.fields.header.functionCode = '01';
    reqHello.fields.header.extenderId = extenderId;
    reqHello.fields.header.messageType = 1;
    reqHello.fields.header.subMessageType = 1;
    reqHello.fields.data.signature = 'HELO'
    reqHello.fields.tail.endCode = '85';
    reqHello.fields.header.dataLength = reqHello.get('data').length();
    logger.debug("Hello Request => "+reqHello.buffer().toString('hex').toUpperCase())
    socket.write(reqHello.buffer())
    // let result = await responseHelloWorker();
    // logger.debug("Hello Request's Await Response => "+JSON.stringify(result));
    // return result;
}


const responseHelloWorker = async (bufData) => {
    // if(typeof header != "object") return;

    logger.debug("Hello Response Buffer => "+bufData.toString('hex').toUpperCase())
    let resHello = frame.Hello.ResponseHello.allocate();
    resHello._setBuff(bufData);
    //mac (6C2995867F27) => (36 43 32 39 39 35 38 36 37 46 32 37 )
    logger.debug("Hello Response => "+resHello.buffer().toString('hex').toUpperCase())
    logger.debug("Hello Response data size => "+resHello.fields.header.dataLength + " == "+ resHello.get('data').length())
    logger.debug("Extenter ID => "+resHello.fields.header.extenderId + "  // "+resHello.fields.data.extenderId)

    // DB 저장
    await influx.writeHelloResponse(resHello);
    logger.info("responseHelloWorker return : "+ JSON.stringify(resHello.fields.data));
    return resHello.fields.data;
}

module.exports = {
    requestHelloWorker,
    responseHelloWorker
};