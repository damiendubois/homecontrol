'use strict';

//execute commands
var musicService = require('./music-service');
var logger = require('../../services/logger-service')(module);

//POST
exports.musicControl = function (req,res){
   var host = req.body.room;
   var jsonToSend = req.body.jsonToSend;
   musicService.musicControl(host,jsonToSend)
   .then(function(result){
     res.status(200).json(result);
   })
   .catch(function(error){
     res.status(500);
     logger.error(error);
   });
};

//PUT
exports.setSleepMusic = function(req,res){
  musicService.setSleepMusic(req.body.plug,req.body.host,req.body.sleepMinutes);
  res.status(200);
};
