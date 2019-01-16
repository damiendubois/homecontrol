'use strict';

var express = require('express');
var router = express.Router();
var programs = require('./programs-controller');

router.get('/:roomId', programs.get);
router.put('/:roomId', programs.editAll);

module.exports = router;