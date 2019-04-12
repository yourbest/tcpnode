'use strict';

const Struct = require('struct');
const Hello = require('./hello.js');

const Header = Struct()
    .chars('startCode', 1, 'hex')           //1
    .chars('functionCode', 1)        //1
    .word16Sle('extenderId')        //2
    .word8Sle('messageType')        //1
    .word8Sle('subMessageType')     //1
    .word16Sle('dataLength');       //2

const EndCode = Struct().chars('endCode', 1, 'hex')


// for Hello ----------------------------------------- //
const SendHello = Struct()
    .struct('header', Header)
    .struct('data', Hello.SendHelloData)
    .struct('tail', EndCode);

const ResponseHello = Struct()
    .struct('header', Header)
    .struct('data', Hello.ResponseHelloData)
    .struct('tail', EndCode);

module.exports = {
    Header
    ,EndCode
    ,SendHello
    ,ResponseHello
}