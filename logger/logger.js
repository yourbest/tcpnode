// config/logConfig.js
"use strict"
// const appRoot = require('app-root-path');    // app root 경로를 가져오는 lib
// console.log("app root = "+appRoot);
// const fs = require("fs")
// // Create the log directory if it does not exist
// if (!fs.existsSync(`${appRoot}/logs`)) {
//     fs.mkdirSync(`${appRoot}/logs`);
// }

const path = require('path');
const winston = require('winston');            // winston lib
const process = require('process');
require("winston-daily-rotate-file")

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp}|${level}|[${label}]::${message}`;    // log 출력 포맷 정의
});

const options = {
    // log파일
    file: {
        level: 'info',
        datePattern: "YYYY-MM-DD",
        filename: './logs/%DATE%-logs.log', // 로그파일을 남길 경로
        handleExceptions: true,
        json: false,
        maxsize: '20m', // 5MB
        maxFiles: '7d',
        colorize: false,
        format: combine(
            // label({ label: 'tcpnode' }),
            label({ label: path.basename(process.mainModule.filename) }),
            timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
            myFormat    // log 출력 포맷
        )
    },
    // 개발 시 console에 출력
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false, // 로그형태를 json으로도 뽑을 수 있다.
        colorize: true,
        format: combine(
            // label({ label: 'tcpnode' }),
            label({ label: path.basename(process.mainModule.filename) }),
            timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
            myFormat
        )
    }
}

let logger = new winston.createLogger({
    transports: [
        //new winston.transports.File(options.file) // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
        new winston.transports.DailyRotateFile(options.file)
    ],
    exitOnError: false,
});

if(process.env.NODE_ENV !== 'production'){
    logger.add(new winston.transports.Console(options.console)) // 개발 시 console로도 출력
}

// function getLogger(label) {
//     if (!winston.loggers.has(label)) {
//         winston.loggers.add(label, {
//             transports: [transport],
//             format: winston.format.label({ label: label }),
//         });
//     }
//     return winston.loggers.get(label);
// }


module.exports = logger;


/**
 var _ = require('lodash');
 var winston = require('winston');
 var path = require('path');
 var baseDir = path.resolve(__dirname, '..');

 // SETUP WINSTON LOGGER
 var container = new winston.Container();
 container.add("exception", {
    console: {
        handleExceptions: true,
        timestamp: true,
        label: "EXCEPTION",
        colorize: true
    }
});
 container.get("exception").exitOnError = false;
 var keys = [];

 module.exports = function(filename) {
    var label = path.relative(baseDir, filename);
    if (!_.contains(keys, label)) {
        container.add(label, {
            console: {
                handleExceptions: false,
                level: 'debug',
                timestamp: true,
                label: label,
                colorize: true
            }
        });
        keys.push(label);
    }
    var logger = container.get(label);
    logger.exitOnError = false;
    return logger;
};

 var logger = require('./logger')(__filename);
 Example output:
2014-07-23T07:05:27.770Z - info: [config/config.js] .......

 **/