'use strict';

var express = require('express');
var router = express.Router();
var alarms = require('./alarms-controller');

router.get('/:roomId', alarms.get);
router.put('/:roomId', alarms.editAll);

module.exports = router;
