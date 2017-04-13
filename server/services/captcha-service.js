'use strict';

var config = require('../config/environment');
var logger = require('./logger-service')(module);
var request = require('request');

var captchaService = {
    checkCaptcha: checkCaptcha
};

module.exports = captchaService;

function checkCaptcha(permissions) {
    return function(req, res, next) {
      if(!req.body || !req.body.captchaResponse){
        return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
      }
      // req.connection.remoteAddress will provide IP address of connected user.
      var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + config.captcha.secretKey +
        "&response=" + req.body.captchaResponse+ "&remoteip=" + req.connection.remoteAddress;
      // Hitting GET request to the URL, Google will respond with success or error scenario.
      request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
          return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }else{
          next();
        }
      });

  };
}
