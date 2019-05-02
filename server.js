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
    // let clientname = socket.remoteAddress+"."+socket.remotePort;
    // clients[clientname] = socket;
    // logger.info("New "+Object.keys(clients).length+"th connected remote address => "+clientname)
    let clientName;
    //초기 접속시 hello 요청
    worker.hello.requestHelloWorker(socket, 1);

    //When Received Data
    socket.on('data', data => {
        let bufData = Buffer.from(data);
        logger.debug('Bytes read('+data.length+') : ' + bufData.toString('hex').toUpperCase());

        //Header 분리
        let header = frame.Common.Header.allocate();
        header._setBuff(bufData.slice(0, 8));
        logger.info("Header="+header.buffer().toString('hex').toUpperCase());

        //extender ID 저장. (원래는 Hello 에서 처리)
        clientName = header.fields.extenderId;
        if(!clients.hasOwnProperty(clientName)){
            clients[clientName] = socket;
            logger.info("New "+Object.keys(clients).length+"th connected remote address("+(socket.remoteAddress+":"+socket.remotePort)+") exi_id => "+clientName)
        }

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
                worker.system.requestSystemSetServer(header, bufData);
                break;
            // case 10:    //IR
            //     break;
            case 11:    //Serial
                switch(header.fields.subMessageType){
                    case 1:
                        worker.serial.responseSerialWrite(header, bufData);
                        break;
                    case 2:
                        worker.serial.responseSerialWriteRead(header, bufData);
                        break;
                    default:
                        break;
                }
                break;
            // case 12:    //Relay
            //     break;
            case 13:    //Current Sensor
                switch(header.fields.subMessageType){
                    case 2:
                        worker.current.responseCurrentGetConfiguration(header, bufData);
                        break;
                    case 3:
                        worker.current.responseCurrentGetStatus(header, bufData);
                        break;
                    default:
                        break;
                }
                break;
            case 14:    //Digital Input
                switch(header.fields.subMessageType){
                    case 3:
                        worker.digital.responseGetStatus(header, bufData);
                        break;
                    default:
                        break;
                }
                break;
            case 100:   //Notify
                switch(header.fields.subMessageType){
                    case 1:
                        worker.notify.PushNotifyDiStatus(header, bufData);
                        break;
                    case 2:
                        worker.notify.PushNotifyCurrentStatus(header, bufData);
                        break;
                    default:
                        break;
                }
                break;
            default:    //무시==> DisConnect !!
                socket.end();
                break;
        }

        /** Just for test **/
        // worker.system.RequestSystemSetIpPort(socket, 0, '192.168.10.2 ', '502')
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
        delete clients[clientName];
        logger.info("Concurrent Connections are "+Object.keys(clients).length)
        //Send a message to every active client that someone just left the room
        // broadcast(`- ${clientname} has left the room\r\n Active Users : ${clientCount}\r\n`);
    });

    //Handle error events
    socket.on('error', error => {
        logger.error(error,  "EVENT :: error");
        // connection.write(`Error : ${error}`);
        delete clients[clientName];
        logger.info("Concurrent Connections are  => "+Object.keys(clients).length)
        socket.end();
    });

});

// server.on('close', () => {
//     logger.info(`Server disconnected`);
// });
//
// server.on('error', error => {
//     logger.info(`Error : ${error}`);
// });

server.listen(9999);
logger.info("--------Server started (9999) ---------------------")



/*********************************************************************
    Periodically Request Test
 *********************************************************************/

setInterval(function() {
            logger.debug("Periodically Hello to Extender Keys : " + Object.keys(clients));
    for(let extId in clients){
        logger.debug("Periodically Hello to Extender ID : " + extId);
        // logger.debug("Type of key:"+extId+" is "+typeof(clients[extId]));
        worker.hello.requestHelloWorker(clients[extId], extId);

    }
    }
    ,10*1000
);


// while(true){
//     //setInterval(worker.system.RequestSystemSetIpPort(socket, 0, '192.168.10.2 ', '502'), 2*1000);
//     // worker.system.RequestSystemSetIpPort(socket, 0, '192.168.10.2 ', '502')
//
// }

// const rpc = require("./network/rpc.js")







