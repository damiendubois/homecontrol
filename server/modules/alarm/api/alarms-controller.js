'use strict';

//execute commands

var alarmService = require('../services/alarm-service');


var alarms=[];


var alarmController = {
  get : get,
  editAll:editAll
};


module.exports = alarmController;


function editAll(req,res){
  alarmService.updateAllAlarmsForRoom(req.body.alarms,req.params.roomId).then(function(){
    res.status(200).json({});
  }).catch(function(error){
    res.status(500);
  });
}

function get(req,res){
  alarmService.getAlarmsForRoom(req.params.roomId).then(function(alarms){
    res.status(200).json(alarms);
  }).catch(function(error){
    res.status(500);
  });
}
