'use strict';

const logger = require("./logger/logger.js")
const frame = require("./frame")
const worker = require("./worker")
const net = require('net');


const maxConn = 10;
//All active connections are stored in this object together with their client name
let clients = {};

const server = net.createServer();
server.maxConnections = maxConn;


//Stores the number of active clients
// let clientCount = 0;

server.on('connection', socket => {
    let clientname = socket.remoteAddress+"."+socket.remotePort;
    clients[clientname] = socket;
    logger.info("New "+Object.keys(clients).length+"th connected remote address => "+clientname)

    //초기 접속시 hello 요청
    let reqHello = worker.hello.requestHelloWorker(socket);

    //When Received Data
    socket.on('data', data => {
        let bufData = Buffer.from(data);
        logger.debug('Bytes read('+data.length+') : ' + bufData.toString('hex').toUpperCase());

        //Header 분리
        let header = frame.Common.Header.allocate();
        header._setBuff(bufData.slice(0, 8));
        logger.info("Header="+header.buffer().toString('hex').toUpperCase());
        // TODO 체크 로직
        /*****************************************************
        1) proxy.header.startCode != 84 아니면 접속종료 (아니면, 무시)
        2) proxy.header.functionCode
        *****************************************************/
        switch(header.fields.messageType){
            case 1:     //Hello (Send Response)
                worker.hello.responseHelloWorker(header, bufData);
                break;
            case 2:     //System Setting
                break;
            case 10:    //IR
                break;
            case 11:    //Serial
                break;
            case 12:    //Relay
                break;
            case 13:    //Current Sensor
                break;
            case 14:    //Digital Input
                break;
            case 100:   //Notify
                break;
            default:    //무시
                break;
        }

        // socket.write(sendHello.buffer());

        // clientname = connection.remoteAddress+" "+connection.remotePort;
    });

    //When Timeout
    socket.on('timeout', () => {
        logger.info("EVENT :: timeout------");
            });

    //A close event is emmited when a connection is disconnected from the server
    socket.on('close', () => {
        logger.info("EVENT :: close");
        //When a client disconnecs, remove the name and connection
        delete clients[clientname];
        logger.info("Concurrent Connections are "+Object.keys(clients).length)
        //Send a message to every active client that someone just left the room
        // broadcast(`- ${clientname} has left the room\r\n Active Users : ${clientCount}\r\n`);
    });

    //Handle error events
    socket.on('error', error => {
        logger.error("EVENT :: error");
        // connection.write(`Error : ${error}`);
        delete clients[clientname];
        logger.info("Concurrent Connections are  => "+Object.keys(clients).length)
        socket.end();
    });

});

server.on('close', () => {
    logger.info(`Server disconnected`);
});

server.on('error', error => {
    logger.info(`Error : ${error}`);
});

server.listen(9999);
logger.info("--------Server started (9999) ---------------------")