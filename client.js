'use strict';

const Net = require('net');
const zeroFill = require('zero-fill')

// This function create and return a net.Socket object to represent TCP client.
let simulator = (connName) => {

    const option = {
        //host: '35.200.87.136',
        host: '127.0.0.1',
        port: 9999
    }

    // Create TCP client.
    const socket = Net.createConnection(option, function () {
        console.log('Connection name : ' + connName);
        console.log('Connection local address : ' + socket.localAddress + ":" + socket.localPort);
        // console.log('Connection remote address : ' + socket.remoteAddress + ":" + socket.remotePort);
    });

    // client.setTimeout(10*1000);
    // client.setEncoding('utf8');

    // When receive server send back data.
    socket.on('data', function (data) {
        console.log('['+connName+']Server return data : ' + Buffer.from(data).toString('hex').toUpperCase());
    });

    // When connection disconnected.
    socket.on('end', function () {
        console.log('Client socket disconnect. ');
    });

    socket.on('timeout', function () {
        console.log('Client connection timeout. ');
        socket.emit('end');
    });

    socket.on('error', function (err) {
        console.log(err, "Error Occured When Client Starting");
    });

    return socket;
}

/**
 8401 0000 64010003 000101 85
  --->DI 1번채널 상태변화 이벤트 감지에 대한 Extender의 Notify 보고(CH1 기존 Falling->Rising 상태 변화 예시)

 8402 0000 6401000A 01000000000000000000 85
 --->DI 1번채널 변화 이벤트에 대한 Controller의 응답


 8401 0000 64020006 00DC03000001 85
 --->전류센서 1번채널 상태변화 이벤트 감지에 대한 Extender의 Notify 보고(트리거레벨 Step:3, 전류값 220mA)

 8402 0000 6402000A 01000000000000000000 85
 --->전류센서 1번채널 변화 이벤트에 대한 Controller의 응답
 */

let clients = [];

clients[0] = simulator('1');
// clients[0].write(Buffer.from('840100016401000300000085', 'hex'));
clients[1] = simulator('2');
// clients[1].write(Buffer.from('840100026401000300000085', 'hex'));
clients[2] = simulator('3');
// clients[2].write(Buffer.from('840100036401000300000085', 'hex'));


/** for Extender loop **/
setInterval(async ()=>{
    for(let i = 0; i<clients.length; i++){
        await sleep(2000);
        clients[i].write(genDigitalData(zeroFill(4,i+1)));
        await sleep(2000);
        clients[i].write(genCurrentData(zeroFill(4,i+1)));
    }
}, 20*1000);

// setInterval(()=>{
//     //for Digital Input
//     for(let i = 0; i<clients.length; i++){
//         setTimeout(()=>{clients[i].write(genDigitalData(zeroFill(4,i+1)));}, (i+1)*1*1000);
//         setTimeout(()=>{clients[i].write(genCurrentData(zeroFill(4,i+1)));}, (i+1)*3*1000);
//     }
// }, 20*1000);


function genDigitalData(extenderId) {
    let bufCommon = Buffer.from('8401'+ extenderId +'64010003', 'hex');

    let bufData = Buffer.alloc(3);
    bufData.writeInt8(genRandNumHex(0, 1),0);
    bufData.writeInt8(genRandNumHex(0, 1),1);
    bufData.writeInt8(genRandNumHex(0, 1),2);
    let bufFinish = Buffer.from('85', 'hex');
    // console.log(Buffer.concat([bufCommon, bufData, bufFinish]));
    return Buffer.concat([bufCommon, bufData, bufFinish]);
}

function genCurrentData(extenderId) {
    // 00DC 03 0000 01
    let bufCommon = Buffer.from('8401'+ extenderId +'64020006', 'hex');

    let bufData = Buffer.alloc(6);
    bufData.writeUInt16LE(genRandNumHex(0, 20000),0);
    bufData.writeInt8(genRandNumHex(1, 3),2);
    bufData.writeUInt16LE(genRandNumHex(0, 20000),3);
    bufData.writeInt8(genRandNumHex(1, 3),5);

    let bufFinish = Buffer.from('85', 'hex');
    // console.log(Buffer.concat([bufCommon, bufData, bufFinish]));
    return Buffer.concat([bufCommon, bufData, bufFinish]);
}

function genRandNumHex(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
    // return dec.toString(16);// hex = dec.toString(16); // === "7b"
}

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
