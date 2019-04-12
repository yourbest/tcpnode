'use strict';

const Logger = require("./logger/logger.js")
const Net = require('net');

// This function create and return a net.Socket object to represent TCP client.
function getConn(connName) {

    const option = {
        host: 'localhost',
        port: 9999
    }

    // Create TCP client.
    const client = Net.createConnection(option, function () {
        Logger.info('Connection name : ' + connName);
        Logger.info('Connection local address : ' + client.localAddress + ":" + client.localPort);
        Logger.info('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });

    client.setTimeout(10*1000);
    client.setEncoding('utf8');

    // When receive server send back data.
    client.on('data', function (data) {
        Logger.info('Server return data : ' + data);
    });

    // When connection disconnected.
    client.on('end', function () {
        Logger.info('Client socket disconnect. ');
    });

    client.on('timeout', function () {
        Logger.info('Client connection timeout. ');
        client.emit('end');
    });

    client.on('error', function (err) {
        // console.error(JSON.stringify(err));
        Logger.error(err, "Error Occured When Client Starting");
    });

    return client;
}

// Create a client socket.
let client = getConn('Java');

client.write('Java is best programming language. ');
