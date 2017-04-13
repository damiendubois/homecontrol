'use strict';

var User = require('../../user/model/user-model');
var logger = require('../../../services/logger-service')(module);
var jsonUtil = require('../../../util/json-object-util');


exports.index = function(req, res) {
  var statistics = {};
  User.count({},
    function (err, userNumber) {
      if(err) { return handleError(res, err); }
      statistics.userNumber = userNumber;

      statistics.contractNumber = 1;

      statistics.customerNumber = 2;

      statistics.fileNumber = 3;
      return res.status(200).json(statistics);

  });
};

function handleError(res, err) {
  logger.error(err);
  return res.status(500);
}
