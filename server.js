'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// require('ssl-root-cas').inject()

const Logger = require("./logger/logger.js")
const Net = require('net');

// Create and return a net.Server object, the function will be invoked when client connect to this server.
const Server = Net.createServer(function (client) {
    Logger.info('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);

    client.setEncoding('utf-8');

    client.setTimeout(10*1000);

    // When receive client data.
    client.on('data', function (data) {

        // Print received client data and length.
        Logger.info('Receive client send data : ' + data + ', data size : ' + client.bytesRead);

        // Server send data back to client use client net.Socket object.
        client.end('Server received data : ' + data + ', send back to client data size : ' + client.bytesWritten);
    });

    // When client send data complete.
    client.on('end', function () {
        Logger.info('Client disconnect.');

        // Get current connections count.
        Server.getConnections(function (err, count) {
            if (!err) {
                // Print current connection count in server console.
                Logger.info("There are %d connections now. ", ++count);
            } else {
                // console.error(JSON.stringify(err));
                Logger.error(err, "Error Occured When GetConnections");
            }

        });
    });

    // When client timeout.
    client.on('timeout', function () {
        Logger.info('Client request time out. ');
    })
});

// Make the server a TCP server listening on port 9999.
Server.listen(9999, function () {

    // Get server address info.
    var serverInfo = Server.address();

    var serverInfoJson = JSON.stringify(serverInfo);

    Logger.info('TCP server listen on address : ' + serverInfoJson);

    Server.on('close', function () {
        Logger.info('TCP server socket is closed.');
    });

    Server.on('error', function (error) {
        Logger.error(err, "Error Occured When Server Starting");
        // console.error(JSON.stringify(error));
    });

});