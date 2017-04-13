'use strict';

var MONGO_ADDR = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var MONGO_PORT = process.env.MONGO_PORT_27017_TCP_PORT || 27017;

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://' + MONGO_ADDR + ':' + MONGO_PORT + '/cawita-homecontrol-dev'
  },

  // If true, sample data will be feed into the database, removing all previous one
  seedDB: true,
  secret : 'bigsecret',
  fileroot : './',
  smtp : {
    user : 'cawita.technologies@gmail.com',
    password : 'Ca19wi11ta87!',
    server : 'smtp.gmail.com',
    port : 587
    },
  captcha: {
    secretKey : '6Lc5chMUAAAAAB4in_hlFG-owAWOuQDjvzFvVtEO',
    siteKey : '6Lc5chMUAAAAADf_rDW1WenvHMXWyVNMqdTg0Aq7'
  }
};
