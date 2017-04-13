'use strict';

var logger = require('../../services/logger-service')(module);
var fs = require('fs');
var config = require('../../config/environment');

var homeDefService = {
  returnHomeDefinition : returnHomeDefinition
};

module.exports = homeDefService;

var homeDefinition= new Promise(function(fullfill,reject){
  fs.readFile(config.fileroot+'server/config/homeDefinition.json','utf8',function (err,data) {
   if (err) {
     reject(err);
   }else{
     fullfill(JSON.parse(data));
   }
  });
});


function returnHomeDefinition(){
   return homeDefinition;
}
