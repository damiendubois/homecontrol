'use strict';

// Test specific configuration
// ===========================
var MONGO_ADDR = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var MONGO_PORT = process.env.MONGO_PORT_27017_TCP_PORT || 27017;

module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://' + MONGO_ADDR + ':' + MONGO_PORT + '/cawita-homecontrol-test'
  },
  secret : 'test',
  smtp : {
    user : 'web@inter-money-transfer.com',
    password : 'Azn3u7*6',
    server : 'mail.inter-money-transfer.com',
    port : 587
    },
  captcha: {
    secretKey : '6Le21RMUAAAAABABhXVQ_9sm5WUJWByT6arIxffu',
    siteKey : '6Le21RMUAAAAABsZu_SvF7CLiOFwlv5h9rWSZo5F'
  }
};
