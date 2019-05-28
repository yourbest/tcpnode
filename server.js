'use strict';

const logger = require("./logger/logger.js");
// logger.debug (" label=>"+JSON.stringify(logger.transports[0]));
const frame = require("./frame");
const worker = require("./worker");
const rpc = require("./network/rpc.js")

const net = require('net');
const maxConn = 100;
//All active connections are stored in this object together with their client name
let clients = {};

const server = net.createServer();
server.maxConnections = maxConn;


//Stores the number of active clients
// let clientCount = 0;

server.on('connection', socket => {
    // let clientname = socket.remoteAddress+"."+socket.remotePort;
    // clients[clientname] = socket;
    logger.info("New Connect Trial from remote address => "+socket.remoteAddress);
    let clientName;

    //초기 접속시 hello 요청
    // worker.hello.requestHelloWorker(socket, 1);

    socket.setTimeout(0);
    //When Received Data
    socket.on('data', (data) => {
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
                        // worker.hello.responseHelloWorker(header, bufData); ==> To RCP
                        //rcp.responseResults[header.fields.extenderId] = data;
                        rpc.rpcEvent.emit('HELLO_RESPONSE', data);
                        break;
                    default:
                        logger.error("ERROR: Wrong Hello Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            case 2:     //System Setting [rpc]
                switch(header.fields.subMessageType){
                    case 4:
                        // worker.system.responseSystemSetServerWorker(bufData);
                        rpc.rpcEvent.emit('SYSTEM_SET_SERVER_RESPONSE', data);
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
                        // worker.serial.responseSerialWriteWorker(header, bufData);
                        rpc.rpcEvent.emit('SERIAL_WRITE_RESPONSE', data);
                        break;

                    case 2:
                        // worker.serial.responseSerialWriteReadWorker(header, bufData);
                        rpc.rpcEvent.emit('SERIAL_WRITE_READ_RESPONSE', data);
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
                        // worker.current.responseCurrentGetConfigurationWorker(header, bufData);
                        rpc.rpcEvent.emit('CURRENT_GET_CONFIGURATION_RESPONSE', data);
                        break;
                    case 3:
                        // worker.current.responseCurrentGetStatusWorker(header, bufData);
                        rpc.rpcEvent.emit('CURRENT_GET_STATUS_RESPONSE', data);
                        break;
                    default:
                        logger.error("ERROR: Wrong Currrnt Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            case 14:    //Digital Input [rpc]
                switch(header.fields.subMessageType){
                    case 3:
                        // worker.digital.responseDigitalGetStatusWorker(header, bufData);
                        rpc.rpcEvent.emit('DIGITAL_GET_STATUS_RESPONSE', data);
                        break;
                    default:
                        logger.error("ERROR: Wrong DigitalInput Format : "+header.buffer().toString('hex').toUpperCase())
                        break;
                }
                break;
            case 100:   //Notify
                switch(header.fields.subMessageType){
                    case 1:
                        worker.notify.pushNotifyDiStatusWorker(bufData)
                        worker.notify.responseNotifyStatusWorker(clients[header.fields.extenderId], header.fields.extenderId, 1);
                        break;
                    case 2:
                        worker.notify.pushNotifyCurrentStatusWorker(bufData)
                        worker.notify.responseNotifyStatusWorker(clients[header.fields.extenderId], header.fields.extenderId,2);
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

    //Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle. The user must manually close the connection.
    socket.on('timeout', () => {
        logger.info("EVENT :: timeout------ then whill close()");
        socket.end();//FIN
        socket.destroy();
    });

    //Emitted when the server closes. Note that if connections exist, this event is not emitted until all connections are ended.
    socket.on('close', () => {
        logger.info("EVENT :: close");
        //When a client disconnecs, remove the name and connection
        socket.end();
        socket.destroy();
        delete clients[clientName];
        logger.info("Concurrent Connections are "+Object.keys(clients).length)
        //Send a message to every active client that someone just left the room
        // broadcast(`- ${clientname} has left the room\r\n Active Users : ${clientCount}\r\n`);
    });

    //Emitted when the other end of the socket sends a FIN packet, thus ending the readable side of the socket.
    socket.on('end', () => {
        logger.info("EVENT :: end");
        socket.destroy();
        delete clients[clientName];
        logger.info("Concurrent Connections are "+Object.keys(clients).length)
    });

    //Emitted when an error occurs. Unlike net.Socket, the 'close' event will not be emitted directly following this event unless server.close() is manually called
    socket.on('error', error => {
        logger.error(error,  "EVENT :: error");
        // connection.write(`Error : ${error}`);
        // delete clients[clientName];
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
server.on('listening', () => {
    console.log(`
 ______    ______    __   __    ______   ______    ______    __        __        ______    ______   
/\\  ___\\  /\\  __ \\  /\\ "-.\\ \\  /\\__  _\\ /\\  == \\  /\\  __ \\  /\\ \\      /\\ \\      /\\  ___\\  /\\  == \\  
\\ \\ \\____ \\ \\ \\/\\ \\ \\ \\ \\-.  \\ \\/_/\\ \\/ \\ \\  __<  \\ \\ \\/\\ \\ \\ \\ \\____ \\ \\ \\____ \\ \\  __\\  \\ \\  __<  
 \\ \\_____\\ \\ \\_____\\ \\ \\_\\\\"\\_\\   \\ \\_\\  \\ \\_\\ \\_\\ \\ \\_____\\ \\ \\_____\\ \\ \\_____\\ \\ \\_____\\ \\ \\_\\ \\_\\
  \\/_____/  \\/_____/  \\/_/ \\/_/    \\/_/   \\/_/ /_/  \\/_____/  \\/_____/  \\/_____/  \\/_____/  \\/_/ /_/  
    `);
    logger.info("Controller running on 0.0.0.0:9999 ---------------------");
});

/*********************************************************************
    Periodically Request Test
 *********************************************************************/

// setInterval(function() {
//     // logger.debug("Periodically Hello to Extender Keys : " + Object.keys(clients));
//     for(let extId in clients){
//         logger.debug("Periodically Hello to Extender ID : " + extId);
//         // logger.debug("Type of key:"+extId+" is "+typeof(clients[extId]));
//         worker.hello.requestHelloWorker(clients[extId], extId);
//
//     }
//     }
//     ,60*1000
// );


// while(true){
//     //setInterval(worker.system.RequestSystemSetIpPort(socket, 0, '192.168.10.2 ', '502'), 2*1000);
//     // worker.system.RequestSystemSetIpPort(socket, 0, '192.168.10.2 ', '502')
//
// }

/*** JSON RPC 서버 시작 **/
rpc.init(clients);

/** for Extender Check Periodically  **/
const util = require('./network/getutil.js');

setInterval(async ()=>{
    Object.keys(clients).forEach(async (key) => {
        let client = clients[key];
        logger.info("PERIOD SENDING : EXTENDER_ID : ["+key+"] ["+client.remoteAddress+":"+client.remotePort+"]");
        if(!client.destroyed) client.write(util.genGetCurrentStatusData(key));
        await sleep(1000*5);
        if(!client.destroyed) client.write(util.genGetDigitalStatusData(key));
        await sleep(1000*5);
    });
}, 2*60*1000);

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve, ms)
    })
}

/**  비정상 예외 처리 **/
process.on('uncaughtException', function(error) {
    logger.error('UnCaughtException Occured : '+error);
});






