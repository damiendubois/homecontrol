'use strict';
var logger = require('./logger-service')(module);

exports.handleError = function (res, err) {
    if(err.code===11000){
      return res.status(409).json({
          success: false,
          msg: err
      });
    }else{
      logger.error(err);
    }
    return res.status(500);
};
