var clients = [];
var log = require('winston');

exports.subscribe = function(req, res) {
    clients.push(res);

    res.on('close', function() {
        clients.splice(clients.indexOf(res), 1);
    });
};

exports.publish = function(message) {
    log.info("publish '%s'", message);

    clients.forEach(function(res) {
        res.end(message);
    });

    clients = [];
};

setInterval(function() {
    log.info(clients.length);
}, 1000);