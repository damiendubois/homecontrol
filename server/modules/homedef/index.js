'use strict';

var express = require('express');
var router = express.Router();
var homedef = require('./homedef-controller');

router.get('/', homedef.getHomeDefinition);

module.exports = router;
