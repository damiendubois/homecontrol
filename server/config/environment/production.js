'use strict';

// Production specific configuration
// =================================
var MONGO_ADDR = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var MONGO_PORT = process.env.MONGO_PORT_27017_TCP_PORT || 27017;

module.exports = {

  // Server IP
  ip: process.env.IP || undefined,

  // Server port
  port: process.env.PORT || 8080,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://' + MONGO_ADDR + ':' + MONGO_PORT + '/cawita-homecontrol'
  },

  // In production our secret will be defined in a environment variable on the server
  secret : 'bigsecret',
  fileroot : '/home/pi/pub/dist/',
  smtp : {
    user : 'cawita.technologies@gmail.com',
    password : 'Ca19wi11ta87!',
    server : 'smtp.gmail.com',
    port : 587
    },
  captcha: {
    secretKey : '6Le21RMUAAAAABABhXVQ_9sm5WUJWByT6arIxffu',
    siteKey : '6Le21RMUAAAAABsZu_SvF7CLiOFwlv5h9rWSZo5F'
  }
};



// Access Key ID:
// AKIAI6242HIGIFJBP4UA
// Secret Access Key:
// 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
