'use strict';

var express = require('express');
var router = express.Router();
var rf = require('./rf-controller');


router.put('/plug',rf.changeStatus);
router.put('/store',rf.changeStoreStatus);

module.exports = router;
