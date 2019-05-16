'use strict'

// const rpc = require('node-json-rpc');
const logger = require("../logger/logger.js")
const worker = require('../worker')
const Server = require('./rpcserver');

const options = {
    port: 5080,
    host: 'localhost',
    path: '/',
    strict: false
};

//TODO RCP 에서 extender의 return을 줘야 함. (비동기로 처리해야 하는데...)
// let responseResults = {};


const EventEmitter = require('events');
const pEvent = require('p-event');
const rpcEvent = new EventEmitter();

const rpcserv = new Server(options);

let clients = {};
const init = function(socks){
    clients = socks;
    rpcserv.start(function (error) {
        if (error){
            logger.error(error.toLocaleString(), "RPC Start ERROR");
            throw error;
        }
        else logger.info('RPC Server running on '+options.host+":"+options.port);
    });
}


/************* COMMON **********************/
rpcserv.addMethod('getExtenderList', function (params, callback) {
    let error, result;
    result = Object.keys(clients);
    logger.info("RPC getExtenderList => "+JSON.stringify(result));
    callback(error, result);
});

/************* HELLO **********************/
rpcserv.addMethod('requestHello', async function (params, callback) {
    let error, result;
    logger.info("RPC RequestHello Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32101, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 1 && params.extenderId) { //extenderId
            //To Controller
            worker.hello.requestHelloWorker(clients[params.extenderId], params.extenderId);

            rpcEvent.once('HELLO_RESPONSE', (msg) => {
                logger.debug("EVENT HELLO_RESPONSE data : "+msg.toString('hex').toUpperCase());
            });
            try{
                let data = await pEvent(rpcEvent, 'HELLO_RESPONSE', {timeout: 10*1000});
                result = await worker.hello.responseHelloWorker(Buffer.from(data));
            } catch (err){
                logger.error("ERROR : during HELLO_RESPONSE event processing ==>"+err);
                rpcEvent.off('HELLO_RESPONSE', ()=>{});
                error = { code: -32102, message: "Event Error : "+err};
            }

            // await new Promise((resolve, reject) => {
            //     rpcEvent.once('HELLO_RESPONSE', (msg) => {
            //         console.log("Hello Response of Extender data : "+msg.toString('hex').toUpperCase());
            //         resolve(msg);
            //     });
            // }).then(async (data) => {
            //     result = await worker.hello.responseHelloWorker(Buffer.from(data));
            // });
        } else {
            error = {code: -32602, message: "Invalid params"};
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :" + JSON.stringify(params));
        }
    }
    callback(error, result);
});

/************* SYSTEM **********************/
rpcserv.addMethod('requestSystemSetServer', async function (params, callback) {
    let error, result;
    logger.info("RPC RequestSystemSetServer Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 3 && params.extenderId) { //extenderId,IP,port
            //To Controller
            worker.system.requestSystemSetServerWorker(clients[params.extenderId], params.extenderId, params.ip, params.port);

            rpcEvent.once('SYSTEM_SET_SERVER_RESPONSE', (msg) => {
                logger.debug("EVENT SYSTEM_SET_SERVER_RESPONSE data : "+msg.toString('hex').toUpperCase());
            });
            try{
                let data = await pEvent(rpcEvent, 'SYSTEM_SET_SERVER_RESPONSE', {timeout: 10*1000});
                result = await worker.system.responseSystemSetServerWorker((Buffer.from(data)));
            } catch (err){
                logger.error("ERROR : during SYSTEM_SET_SERVER_RESPONSE event processing ==>"+err);
                rpcEvent.off('SYSTEM_SET_SERVER_RESPONSE', ()=>{});
                error = { code: -32102, message: "Event Error : "+err};
            }

        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

/************* SERIAL **********************/
rpcserv.addMethod('requestSerialWrite', async function (params, callback) {
    let error, result;
    logger.info("RPC requestSerialWrite Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 8 && params.extenderId) { //extenderId, port, uart1, uart2, uart3, uart4, uart5, data
            //To Controller
            worker.system.requestSerialWriteWorker(clients[params.extenderId], params.extenderId, params.port, params.uart1, params.uart2, params.uart3, params.uart4, params.uart5, params.data);

            rpcEvent.once('SERIAL_WRITE_RESPONSE', (msg) => {
                logger.debug("EVENT SERIAL_WRITE_RESPONSE data : "+msg.toString('hex').toUpperCase());
            });
            try{
                let data = await pEvent(rpcEvent, 'SERIAL_WRITE_RESPONSE', {timeout: 10*1000});
                result = await worker.serial.responseSerialWriteWorker((Buffer.from(data)));
            } catch (err){
                logger.error("ERROR : during SERIAL_WRITE_RESPONSE event processing ==>"+err);
                rpcEvent.off('SYSTEM_SET_SERVER_RESPONSE', ()=>{});
                error = { code: -32102, message: "Event Error : "+err};
            }
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

rpcserv.addMethod('requestSerialWriteRead', async function (params, callback) {
    let error, result;
    logger.info("RPC requestSerialWriteRead Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 8 && params.extenderId) { //extenderId,IP,port
            //To Controller
            worker.system.requestSerialWriteReadWorker(clients[params.extenderId], params.extenderId, params.port, params.uart1, params.uart2, params.uart3, params.uart4, params.uart5, params.data);

            rpcEvent.once('SERIAL_WRITE_READ_RESPONSE', (msg) => {
                logger.debug("EVENT SERIAL_WRITE_READ_RESPONSE data : "+msg.toString('hex').toUpperCase());
            });
            try{
                let data = await pEvent(rpcEvent, 'SERIAL_WRITE_READ_RESPONSE', {timeout: 10*1000});
                result = await worker.serial.responseSerialWriteReadWorker((Buffer.from(data)));
            } catch (err){
                logger.error("ERROR : during SERIAL_WRITE_READ_RESPONSE event processing ==>"+err);
                rpcEvent.off('SERIAL_WRITE_READ_RESPONSE', ()=>{});
                error = { code: -32102, message: "Event Error : "+err};
            }
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

/************* CURRENT SENSOR **********************/
rpcserv.addMethod('requestCurrentGetConfiguration', async function (params, callback) {
    let error, result;
    logger.info("RPC requestCurrentGetConfiguration Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 1 && params.extenderId) { //extenderId
            //To Controller
            worker.current.requestCurrentGetConfigurationWorker(clients[params.extenderId], params.extenderId);

            rpcEvent.once('CURRENT_GET_CONFIGURATION_RESPONSE', (msg) => {
                logger.debug("EVENT CURRENT_GET_CONFIGURATION_RESPONSE data : "+msg.toString('hex').toUpperCase());
            });
            try{
                let data = await pEvent(rpcEvent, 'CURRENT_GET_CONFIGURATION_RESPONSE', {timeout: 10*1000});
                result = await worker.current.responseCurrentGetConfigurationWorker((Buffer.from(data)));
            } catch (err){
                logger.error("ERROR : during CURRENT_GET_CONFIGURATION_RESPONSE event processing ==>"+err);
                rpcEvent.off('CURRENT_GET_CONFIGURATION_RESPONSE', ()=>{});
                error = { code: -32102, message: "Event Error : "+err};
            }
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

rpcserv.addMethod('requestCurrentGetStatus', async function (params, callback) {
    let error, result;
    logger.info("RPC requestCurrentGetStatus Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 1 && params.extenderId) { //extenderId
            //To Controller
            worker.current.requestCurrentGetStatusWorker(clients[params.extenderId], params.extenderId);

            rpcEvent.once('CURRENT_GET_STATUS_RESPONSE', (msg) => {
                logger.debug("EVENT CURRENT_GET_STATUS_RESPONSE data : "+msg.toString('hex').toUpperCase());
            });
            try{
                let data = await pEvent(rpcEvent, 'CURRENT_GET_STATUS_RESPONSE', {timeout: 10*1000});
                result = await worker.current.responseCurrentGetStatusWorker((Buffer.from(data)));
            } catch (err){
                logger.error("ERROR : during CURRENT_GET_STATUS_RESPONSE event processing ==>"+err);
                rpcEvent.off('CURRENT_GET_STATUS_RESPONSE', ()=>{});
                error = { code: -32102, message: "Event Error : "+err};
            }
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

/************* DIGITAL **********************/
rpcserv.addMethod('requestDigitalGetStatus', async function (params, callback) {
    let error, result;
    logger.info("RPC requestDigitalGetStatus Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 1 && params.extenderId) { //extenderId
            //To Controller
            worker.digital.requestDigitalGetStatusWorker(clients[params.extenderId], params.extenderId);

            rpcEvent.once('DIGITAL_GET_STATUS_RESPONSE', (msg) => {
                logger.debug("EVENT DIGITAL_GET_STATUS_RESPONSE data : "+msg.toString('hex').toUpperCase());
            });
            try{
                let data = await pEvent(rpcEvent, 'DIGITAL_GET_STATUS_RESPONSE', {timeout: 10*1000});
                result = await worker.current.responseCurrentGetStatusWorker((Buffer.from(data)));
            } catch (err){
                logger.error("ERROR : during DIGITAL_GET_STATUS_RESPONSE event processing ==>"+err);
                rpcEvent.off('DIGITAL_GET_STATUS_RESPONSE', ()=>{});
                error = { code: -32102, message: "Event Error : "+err};
            }
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

module.exports = {
    init,
    rpcEvent,
    // responseMessage
}


/**
 * RPC Client
 * ==> curl -d '{"jsonrpc": "2.0", "method": "test", "params": [1,2], "id": null}' 127.0.0.1:5080
 * ==> (on Windows) curl --proxy "" -H "Content-Type: application/json" -d "{\"jsonrpc\": \"2.0\", \"method\": \"requestHello\", \"params\": {\"extenderId\":1}, \"id\": null}" http://127.0.0.1:5080

 */
/**
 var rpc = require('node-json-rpc');

 var options = {
  port: 5080,
  host: '127.0.0.1',
  path: '/',
  strict: false
};

 var client = new rpc.Client(options);

 client.call(
 {"jsonrpc": "2.0", "method": "test", "params": [1,2], "id": null},
 function (err, res) {
    if (err) { console.log(err); }
    else { console.log(res); }
  }
 );

 client.call(
 {"method": "myMethod", "params": [1,2], "id": 2},
 function (err, res) {
    if (err) { console.log(err); }
    else { console.log(res); }
  }
 );
 */

// rpcserv.addMethod('test', function (params, callback) {
//     let error, result;
//     console.log(params)
//     if (params.length === 2) {
//         result = params[0] + params[1];
//     } else if (params.length > 2) {
//         result = 0;
//         params.forEach(function (v, i) {
//             result += v;
//         });
//     } else {
//         error = { code: -32602, message: "Invalid params" };
//         logger.error(error, "RPC ERROR : Wrong Params :"+ params);
//     }
//
//     callback(error, result);
// });
