'use strict';

var mongoose = require('mongoose');
var logger = require('../services/logger-service')(module);

module.exports = function (config) {
mongoose.Promise = require("es6-promise").Promise;
  // Connect to database
  var db = mongoose.connect(config.mongo.uri, config.mongo.options, function (err) {
    if (err) {
      logger.error('Could not connect to MongoDB!');
      logger.log(err);
    }
  });

  mongoose.connection.on('error', function (err) {
    logger.error('MongoDB connection error: ' + err);
    process.exit(-1);
  });

  // Populate DB with sample data
  if (config.seedDB) {
    require('./seed');
  }

  return db;
};
