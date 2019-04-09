'use strict';

const {DebugLogger, InfoLogger, ErrorLogger} = require("./logger/logger.js")
const net = require('net');

// This function create and return a net.Socket object to represent TCP client.
function getConn(connName) {

    const option = {
        host: 'localhost',
        port: 9999
    }

    // Create TCP client.
    const client = net.createConnection(option, function () {
        InfoLogger('Connection name : ' + connName);
        InfoLogger('Connection local address : ' + client.localAddress + ":" + client.localPort);
        InfoLogger('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });

    client.setTimeout(10*1000);
    client.setEncoding('utf8');

    // When receive server send back data.
    client.on('data', function (data) {
        InfoLogger('Server return data : ' + data);
    });

    // When connection disconnected.
    client.on('end', function () {
        InfoLogger('Client socket disconnect. ');
    });

    client.on('timeout', function () {
        InfoLogger('Client connection timeout. ');
    });

    client.on('error', function (err) {
        // console.error(JSON.stringify(err));
        ErrorLogger(err, "Error Occured When Client Starting");
    });

    return client;
}

// Create a client socket.
let client = getConn('Java');

client.write('Java is best programming language. ');
