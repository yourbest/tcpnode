'use strict';

const Struct = require('struct');

const Header = Struct()
    .chars('startCode', 1, 'hex')           //1
    .chars('functionCode', 1, 'hex')        //1
    .word16Ube('extenderId')        //2
    .word8Ube('messageType')        //1
    .word8Ube('subMessageType')     //1
    .word16Ube('dataLength');       //2

const Tail = Struct().chars('endCode', 1, 'hex')

module.exports = {
    Header
    ,Tail
}
