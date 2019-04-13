'use strict';

const Logger = require("./logger/logger.js")
const struct = require("./struct/common.js")
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
    Logger.info("New connected remote address => "+clientname)

    //Send Hello Packet
    let sendHello = struct.SendHello.allocate();
    sendHello.fields.header.startCode = '84';
    sendHello.fields.header.functionCode = '01';
    sendHello.fields.header.exptenderId = 0;
    sendHello.fields.header.msgType = 1;
    sendHello.fields.header.subMsgType = 1;
    sendHello.fields.data.signature = 'HELO'
    sendHello.fields.tail.endCode = '85';
    sendHello.fields.header.dataLength = sendHello.fields.data.signature.length;
    Logger.info("Hello Return => "+sendHello.buffer().toString('hex'))

    clients[clientname] = socket;
    Logger.info("Concurrent Connections are  => "+Object.keys(clients).length)

    // connection.write(`Please enter a room name\r\n`);
    // connection.setEncoding('utf-8');

    // //When Connected
    // connection.on('connection', () => {
    //     clientname = connection.remoteAddress+" "+connection.remotePort;
    //     Logger.debug("New conneced remote address => "+clientname)
    //
    //     //Increase the number of active clients
    //     // clientCount++;
    //     //Store the connections by client name
    //     clients[clientname] = connection;
    // });

    //When Received Data
    socket.on('data', data => {
        Logger.info("EVENT :: data Length => "+data.length);
        let bufData = Buffer.from(data);
        Logger.info('Bytes read : ' + bufData.toString('hex').toUpperCase());

        // let sendHello = struct.SendHello.allocate();
        // let proxy = sendHello.fields;
        // sendHello._setBuff(Buffer.from(data));
        // console.log(sendHello.buffer());
        // proxy.header.startCode = '85'
        // proxy.tail.endCode = '88';
        // console.log(sendHello.buffer());
        // sendHello.fields.tail.endCode = '0x85';
        // console.log("startCode = " + Buffer.from(sendHello.fields.tail.endCode));

        let header = struct.Header.allocate();
        header._setBuff(bufData.slice(0, 8));
        Logger.info("header="+header.buffer().toString('hex').toUpperCase());
        // TODO 분기 로직
        /*****************************************************
        1) proxy.header.startCode != 84 아니면 접속종료 (아니면, 무시)
        2) proxy.header.functionCode
        *****************************************************/
        let bufResp;
        switch(header.fields.messageType){
            case 1:     //Hello
                    // if()
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
        Logger.info("EVENT :: timeout------");
            });

    //A close event is emmited when a connection is disconnected from the server
    socket.on('close', () => {
        Logger.info("EVENT :: close");
        //When a client disconnecs, remove the name and connection
        delete clients[clientname];
        Logger.info("Concurrent Connections are  => "+Object.keys(clients).length)
        //Send a message to every active client that someone just left the room
        // broadcast(`- ${clientname} has left the room\r\n Active Users : ${clientCount}\r\n`);
    });

    //Handle error events
    socket.on('error', error => {
        Logger.error("EVENT :: error");
        // connection.write(`Error : ${error}`);
        delete clients[clientname];
        Logger.info("Concurrent Connections are  => "+Object.keys(clients).length)
        socket.end();
    });

});

server.on('close', () => {
    Logger.info(`Server disconnected`);
});

server.on('error', error => {
    Logger.info(`Error : ${error}`);
});

server.listen(9999);
Logger.info("-----------------------------")