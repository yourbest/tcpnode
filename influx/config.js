'use strict'

const Influx = require('influxdb-nodejs');

const client = new Influx('http://127.0.0.1:8086/mydb');

// // i --> integer
// // s --> string
// // f --> float
// // b --> boolean
// const fieldHelloSchema = {
//     use: 'i',
//     bytes: 'i',
//     url: 's',
// };
// const tagHelloSchema = {
//     spdy: ['speedy', 'fast', 'slow'],
//     method: '*',
//     // http stats code: 10x, 20x, 30x, 40x, 50x
//     type: ['1', '2', '3', '4', '5'],
// };
//
// client.schema('http', fieldHelloSchema, tagHelloSchema, {
//     // default is false
//     stripUnknown: true,
// });
//
// client.write('http')
//     .tag({
//         spdy: 'fast',
//         method: 'GET',
//         type: '2',
//     })
//     .field({
//         use: 300,
//         bytes: 2312,
//         url: 'https://github.com/vicanso/influxdb-nodejs',
//     })
//     .then(() => console.info('write point success'))
//     .catch(console.error);