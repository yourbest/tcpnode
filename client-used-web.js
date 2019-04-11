'use strict';

const Logger = require("./logger/logger.js")

const net_client = require('net');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const command = parseInt(req.query.command, 10);
    Logger.info("request command is "+command);

    writeData(client, "Command from Web Browser is "+command);

    res.send('command='+command);
});

app.listen(8888, () => Logger.info('Commander listening on port 8888!'));

//------------------------------------------------------------------------//

function getConnection(){
    //서버에 해당 포트로 접속 
    var client = "";
    var recvData = [];
    var local_port = "";

    client = net_client.connect({port: 9999, host:'localhost'}, function() {

        Logger.info("connect log======================================================================");
        Logger.info('connect success');
        Logger.info('local = ' + this.localAddress + ':' + this.localPort);
        Logger.info('remote = ' + this.remoteAddress + ':' +this.remotePort);

        local_port = this.localPort;

        this.setEncoding('utf8');
        this.setTimeout(600*1000); // timeout : 10분
        Logger.info("client setting Encoding:binary, timeout:600000" );
        Logger.info("client connect localport : " + local_port);
    });

    // 접속 종료 시 처리 
    client.on('close', function() {
        Logger.info("client Socket Closed : " + " localport : " + local_port);
    });

// 데이터 수신 후 처리 
    client.on('data', function(data) {
        Logger.info("data recv log======================================================================");
        recvData.push(data);
        Logger.info("data.length : " + data.length);
        Logger.info("data recv : " + data);
        client.end();
    });

    client.on('end', function() {
        Logger.info('client Socket End');
    });

    client.on('error', function(err) {
        Logger.info('client Socket Error: '+ JSON.stringify(err));
    });

    client.on('timeout', function() {
        Logger.info('client Socket timeout: ');
    });

    client.on('drain', function() {
        Logger.info('client Socket drain: ');
    });

    client.on('lookup', function() {
        Logger.info('client Socket lookup: ');
    });
    return client;
}

function writeData(socket, data){
    Logger.info('send data to Server: '+ data);
    var success = !socket.write(data);
    if (!success){
        Logger.info("Server Send Fail");
    }
}

var client = getConnection();
writeData(client, "Hello from Client");





