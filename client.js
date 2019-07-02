'use strict';

const Net = require('net');
const zeroFill = require('zero-fill')

// This function create and return a net.Socket object to represent TCP client.
let simulator = (connName) => {

    const option = {
        host: 'localhost',
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
    //TODO 똑바로 응답하는 코드 만들어야 함.
    socket.on('data', function (data) {
        let bufData = Buffer.from(data);;
        let hexData = bufData.toString('hex').toUpperCase();
        console.log('['+connName+'] from Server data : ' + hexData);

        let extId = hexData.substring(4,8);
        let resp = '8402'+extId;
        console.log('extId:'+extId+', code:'+hexData.substring(8,12));
        switch(hexData.substring(8,12)){
            case '0101'://Current Get Configuration Response => 8402 0001 0101 001E4C4D4538303031303030303844433143323536410000000000000000000085
                resp +='0101001E4C4D4538303031303030303844433143323536410000000000000000000085';
                console.log('Hello Response Data ==>'+resp);
                break;
            case '0D02'://Current Get Configuration Response => 8402 0100 0D02 0011020000007800B4004F008200960048000085
                resp +='0D020011020000007800B4004F008200960048000085';
                break;
            case '0D03'://Current Get Status Response => 840201000D030006000001007D0185
                resp +='0D030006000001007D0185';
                break;
            case '0E03'://Digital Get Status Response => 840201000E03000301010185
                resp +='0E03000301010185';
                break;
            default:
                break;
        }
        console.log('Response Data ==>'+resp);
        socket.write(Buffer.from(resp,'hex'));

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
        clients[i].write(genDigitalData(zeroFill(4,i+100)));
        await sleep(2000);
        clients[i].write(genCurrentData(zeroFill(4,i+100)));
    }
}, 60*1000);

/** just once **/
// for(let i = 0; i<clients.length; i++){
//     clients[i].write(genDigitalData(zeroFill(4,i+100)));
//     clients[i].write(genCurrentData(zeroFill(4,i+100)));
// }


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
    bufData.writeUInt16BE(genRandNumHex(0, 10000),0);
    bufData.writeInt8(genRandNumHex(1, 3),2);
    bufData.writeUInt16BE(genRandNumHex(0, 10000),3);
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
