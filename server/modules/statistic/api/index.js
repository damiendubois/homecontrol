'use strict';

var express = require('express');
var router = express.Router();
var statistic = require('./statistic-controller');
var loggingService = require('../../user/services/logging-service');

//retrieve the list of all actors
router.get('/', loggingService.checkPermission('admin'), statistic.index);

module.exports = router;
