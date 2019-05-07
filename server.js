'use strict';

const logger = require("./logger/logger.js");
// logger.debug (" label=>"+JSON.stringify(logger.transports[0]));
const frame = require("./frame");
const worker = require("./worker");

logger.debug("Logger Test", {label: "myLogger"});





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
    // worker.hello.requestHelloWorker(socket, 1);

    //When Received Data
    socket.on('data', data => {
        let bufData = Buffer.from(data);
        logger.debug('Bytes read('+data.length+') : ' + bufData.toString('hex').toUpperCase());

        //Header 분리
        if(data.length < 10) return;//abnormal telegram
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
                switch(header.fields.subMessageType){
                    case 1:
                        worker.hello.responseHelloWorker(header, bufData);
                        break;
                    default:
                        logger.error("ERROR: Wrong Hello Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            case 2:     //System Setting [rpc]
                switch(header.fields.subMessageType){
                    case 4:
                        worker.system.responseSystemSetServerWorker(header, bufData);
                        break;
                    default:
                        logger.error("ERROR: Wrong SystemSetting Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            // case 10:    //IR
            //     break;
            case 11:    //Serial [rpc]
                switch(header.fields.subMessageType){
                    case 1:
                        worker.serial.responseSerialWriteWorker(header, bufData);
                        break;
                    case 2:
                        worker.serial.responseSerialWriteReadWorker(header, bufData);
                        break;
                    default:
                        logger.error("ERROR: Wrong Serial Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            // case 12:    //Relay
            //     break;
            case 13:    //Current Sensor [rpc]
                switch(header.fields.subMessageType){
                    case 2:
                        worker.current.responseCurrentGetConfigurationWorker(header, bufData);
                        break;
                    case 3:
                        worker.current.responseCurrentGetStatusWorker(header, bufData);
                        break;
                    default:
                        logger.error("ERROR: Wrong Currrnt Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            case 14:    //Digital Input [rpc]
                switch(header.fields.subMessageType){
                    case 3:
                        worker.digital.responseDigitalGetStatusWorker(header, bufData);
                        break;
                    default:
                        logger.error("ERROR: Wrong DigitalInput Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            case 100:   //Notify
                switch(header.fields.subMessageType){
                    case 1:
                        worker.notify.pushNotifyDiStatusWorker(header, bufData)
                            .then(worker.notify.responseNotifyStatusWorker(clients[header.fields.extenderId], header.fields.extenderId), 1);
                        break;
                    case 2:
                        worker.notify.pushNotifyCurrentStatusWorker(header, bufData)
                            .then(worker.notify.responseNotifyStatusWorker(clients[header.fields.extenderId], header.fields.extenderId), 2);
                        break;
                    default:
                        logger.error("ERROR: Wrong Notify Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            default:    //무시==> DisConnect !!
                // socket.end();
                logger.error("ERROR: Wrong Format : "+header.buffer().toString('hex').toUpperCase())
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


/**  비정상 예외 처리 **/
process.on('uncaughtException', function(error) {
    logger.error('UnCaughtException occured : '+error);
});

/*********************************************************************
    Periodically Request Test
 *********************************************************************/

setInterval(function() {
    // logger.debug("Periodically Hello to Extender Keys : " + Object.keys(clients));
    for(let extId in clients){
        logger.debug("Periodically Hello to Extender ID : " + extId);
        // logger.debug("Type of key:"+extId+" is "+typeof(clients[extId]));
        worker.hello.requestHelloWorker(clients[extId], extId);

    }
    }
    ,30*1000
);


// while(true){
//     //setInterval(worker.system.RequestSystemSetIpPort(socket, 0, '192.168.10.2 ', '502'), 2*1000);
//     // worker.system.RequestSystemSetIpPort(socket, 0, '192.168.10.2 ', '502')
//
// }

const rpc = require("./network/rpc.js");
rpc.init(clients);







