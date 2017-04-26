'use strict';
//execute commands
var util = require('util');
var exec = require('child-process-promise').exec;
var sleep = require('sleep');
var scriptPlug = "sudo /home/pi/wiringPi/433Utils/RPi_utils/send";
var scriptStore = "sudo piHomeEasy 0 ";

var rfController = {
  changePlugStatus : changePlugStatus,
  changeStoreStatus : changeStoreStatus
};

module.exports = rfController;


function changeStoreStatus(code,plug,action){
  if(action==="up"){
    return storeUp(code , plug);
  }
  if(action==="down"){
    return storeDown(code , plug);
  }
  if(action==="fulldown"){
    return storeFullDown(code , plug);
  }
}

 function changePlugStatus(plug,status){
 var command = getPlugCode(plug);
 return switchStatus(command,status);
}

var timeOutBeforeDown;
function storeFullDown(code,plugId){
  if(timeOutBeforeDown){
    return;
  }
  return exec(scriptStore + code+ " "+ plugId+" off")
    .then(function(){
      timeOutBeforeDown = setTimeout(function(){
        exec(scriptStore + code+ " "+ plugId + " off")
          .then(function(){
            timeOutBeforeDown = null;
          });
      },36000);
    });
}

function storeDown(code,plugId){
  return exec(scriptStore + code+ " "+ plugId + " off");
}

function storeUp(code,plugId){
  return exec(scriptStore  + code+ " "+ plugId+ " on");
}

function switchStatus( command, status){
  var statusNumber = 0;
  if (status==="on"){
    statusNumber = 1;
  }
   return exec(scriptPlug + " " + command + " " + statusNumber);
}

function getPlugCode(plug){
   return plug.FMCode + " " + plug.plugNumber ;
}
