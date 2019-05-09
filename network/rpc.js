'use strict'

const rpc = require('node-json-rpc');
const logger = require("../logger/logger.js")
const worker = require('../worker')

const options = {
    port: 5080,
    host: 'localhost',
    path: '/',
    strict: false
};

//TODO RCP 에서 extender의 return을 줘야 함. (비동기로 처리해야 하는데...)

const rpcserv = new rpc.Server(options);

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
rpcserv.addMethod('requestHello', function (params, callback) {
    let error, result;
    logger.info("RPC RequestHello Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 1) { //extenderId
            result = worker.hello.requestHelloWorker(clients[params.extenderId], params.extenderId);
        } else {
            error = {code: -32602, message: "Invalid params"};
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :" + JSON.stringify(params));
        }
    }
    callback(error, result);
});

/************* SYSTEM **********************/
rpcserv.addMethod('requestSystemSetServer', function (params, callback) {
    let error, result;
    logger.info("RPC RequestSystemSetServer Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 3) { //extenderId,IP,port
            result = worker.system.requestSystemSetServerWorker(clients[params.extenderId], params.extenderId, params.ip, params.port);
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

/************* SERIAL **********************/
rpcserv.addMethod('requestSerialWrite', function (params, callback) {
    let error, result;
    logger.info("RPC requestSerialWrite Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 3) { //extenderId,IP,port
            result = worker.system.requestSerialWriteWorker(clients[params.extenderId], params.extenderId, params.ip, params.port);
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

rpcserv.addMethod('requestSerialWriteRead', function (params, callback) {
    let error, result;
    logger.info("RPC requestSerialWriteRead Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 3) { //extenderId,IP,port
            result = worker.system.requestSerialWriteReadWorker(clients[params.extenderId], params.extenderId, params.ip, params.port);
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

/************* CURRENT SENSOR **********************/
rpcserv.addMethod('requestCurrentGetConfiguration', function (params, callback) {
    let error, result;
    logger.info("RPC requestCurrentGetConfiguration Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 1) { //extenderId
            result = worker.current.requestCurrentGetConfigurationWorker(clients[params.extenderId], params.extenderId);
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

rpcserv.addMethod('requestCurrentGetStatus', function (params, callback) {
    let error, result;
    logger.info("RPC requestCurrentGetStatus Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 1) { //extenderId
            result = worker.current.requestCurrentGetStatusWorker(clients[params.extenderId], params.extenderId);
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

/************* DIGITAL **********************/
rpcserv.addMethod('requestDigitalGetStatus', function (params, callback) {
    let error, result;
    logger.info("RPC requestDigitalGetStatus Params "+JSON.stringify(params));
    if(typeof clients[params.extenderId] == 'undefined') {
        error = { code: -32001, message: "No Extender[id=>"+params.extenderId+"] is connected" };
    } else {
        if (Object.keys(params).length >= 1) { //extenderId
            result = worker.current.requestCurrentGetStatusWorker(clients[params.extenderId], params.extenderId);
        } else {
            error = { code: -32602, message: "Invalid params" };
            logger.error(error.toLocaleString(), "RPC ERROR : Wrong Params :"+ JSON.stringify(params));
        }
    }
    callback(error, result);
});

module.exports = {
    init
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
