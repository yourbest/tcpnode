// ./service/log.js
const {logger} = require("./logger-config")

// const onStart = () => {
//     logger.info("server start")
// }

const onDebug = (msg) => {
    logger.debug(msg)
}
const onInfo = (msg) => {
    logger.info(msg)
}
const onError = (error, msg) => {
    error.msg = msg
    logger.error(`Error on sending message: msgseq=${msg.data.msgseq} | msg=${msg.data.msg}`)
    logger.error(error)
}

const onSendingMsgError = (error, msg) => {
    error.msg = msg
    logger.error(`Error on sending message: msgseq=${msg.data.msgseq} | msg=${msg.data.msg}`)
    logger.error(error)
}

module.exports = {
    DebugLogger: onDebug,
    InfoLogger: onInfo,
    ErrorLogger: onError
    // onStart: onStart
}