'use strict'

const rpc = require('node-json-rpc');

const options = {
    port: 5080,
    host: 'localhost',
    path: '/',
    strict: false
};

const serv = new rpc.Server(options);

serv.addMethod('test', function (params, callback) {
    let error, result;
    console.log(params)
    if (params.length === 2) {
        result = params[0] + params[1];
    } else if (params.length > 2) {
        result = 0;
        params.forEach(function (v, i) {
            result += v;
        });
    } else {
        error = { code: -32602, message: "Invalid params" };
    }

    callback(error, result);
});

serv.start(function (error) {
    if (error) throw error;
    else console.log('RPC Server running on '+options.host+":"+options.port);
});

module.exports = {
    serv
}


/**
 * RPC Client
 * ==> curl -d '{"jsonrpc": "2.0", "method": "test", "params": [1,2], "id": null}' 127.0.0.1:5080
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