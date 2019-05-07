'use strict';

module.exports = {
    hello: require('./helloWorker.js'),
    system: require('./systemWorker.js'),
    // ir: require('./helloWorker.js'),
    serial: require('./serialWorker.js'),
    // relay: require('./relayWorker.js'),
    current: require('./currentWorker.js'),
    digital: require('./digitalWorker.js'),
    notify: require('./notifyWorker.js'),
};

