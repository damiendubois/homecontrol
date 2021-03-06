'use strict';

var express = require('express');
var router = express.Router();
var programs = require('./programs-controller');

router.get('/', programs.get);
router.put('/', programs.editAll);
router.post('/', programs.runProgram);

module.exports = router;