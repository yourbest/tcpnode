'use strict'

const logger = require("../logger/logger.js")

const Influx = require('influxdb-nodejs');
const client =new Influx('http://tcpnode:tcpnode@localhost:8086/tcpnode');

client.showDatabases()
    .then(databases => {
        logger.info("Database Connection is OK ! ---------------------");
        if (!databases.includes('tcpnode')) {
            logger.info("Database 'tcpnode' is absent. so, trying to create it.")
            client.createDatabase();
        }
    })
    // .then(
    //     return this.showDatabases();
    // )
    .catch(err => {
        logger.error('Errors on influxdb. Confirm InfluxDB is running :'+err);
        process.exit(1);
    })

module.exports = client;





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