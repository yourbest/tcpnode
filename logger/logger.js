// config/logConfig.js
"use strict"

require("winston-daily-rotate-file")

const {createLogger, format, transports} = require("winston")
const fs = require("fs")

const env = process.env.NODE_ENV || "development"
const logDir = "./logs"

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    level: "debug",
    filename: `${logDir}/%DATE%-logs.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxSize: "20m",
    maxFiles: "14d"
})

const logger = createLogger({
    level: env === "development" ? "debug" : "info",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.json()
    ),
    transports: [
        new transports.Console({
            level: "debug",
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ]
})

module.exports = logger