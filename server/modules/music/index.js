'use strict';

var express = require('express');
var router = express.Router();
var music = require('./music-controller');

router.post('/sleep', music.setSleepMusic);
router.post('/', music.musicControl);

module.exports = router;
