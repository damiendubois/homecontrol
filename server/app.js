'use strict';

var logger = require('./services/logger-service')(module);
// on lance l'application directement (node server.js)
if (require.main === module) {
    startServer();
}
// ou on lance via le cluster (node serverCluster.js)
else {
    module.exports = startServer;
}

function startServer(cluster) {

    // Set default node environment to development
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';

    var express = require('express');
    var mongoose = require('mongoose');
    var config = require('./config/environment');
    var bodyParser = require('body-parser');
    var errDomain = require('domain');

    // DB connection and config
    require('./config/db')(config);

    // Setup server
    var app = express();


    // get our request parameters
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());

    // Express configuration
    require('./config/express')(app);
    // Route configuration
    require('./routes')(app);


    // Start server
    var server = app.listen(config.port, config.ip, function() {
        logger.info('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
}
