'use strict';

//execute commands
var util = require('util');
var exec = require('child-process-promise').exec;
var sleep = require('sleep');
var rfService = require('../rf/rf-service');

var sleepTimeOut;

var musicService = {
  musicControl: musicControl,
  setSleepMusic: setSleepMusic
};

module.exports = musicService;

function musicControl (host,jsonToSend){
   var url = "http://"+host+":8080/jsonrpc";
   var execString = "curl -i -X POST -H 'Content-Type: application/json' -d '" +JSON.stringify(jsonToSend)+ "' " + url;
   // console.log("Executing: " + execString);
   return exec(execString)
   .then(function(result){
       var outputSplited = result.stdout.split('\r\n\r\n');
       if(outputSplited.length>1){
           return outputSplited[1];
       }
       return {};
   });
}

function setSleepMusic(plug,host,sleepMinutes){

   if(sleepTimeOut){
     clearTimeout(sleepTimeOut);
   }
   sleepTimeOut = setTimeout(
       function(){
       var plug = plug;
         var host = host;
         rfService.changePlugStatus(plug,0);
           var url = "http://"+host+"/jsonrpc";
           var jsonToSend='{jsonrpc: "2.0", method: "Player.Stop", id: 1, params: {playerid: 0}';
           var execString = "curl -i -X POST -H 'Content-Type: application/json' -d '" +jsonToSend+ "' " + url;
          // console.log("Executing: " + execString);
           exec(execString);
       },sleepMinutes*60000);
}
