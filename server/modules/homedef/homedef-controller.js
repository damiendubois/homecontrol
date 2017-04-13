'use strict';

var logger = require('../../services/logger-service')(module);
var homeDefService = require('./homedef-service');

var homeDefController = {
  getHomeDefinition : getHomeDefinition
};

module.exports = homeDefController;

function getHomeDefinition (req,res){
   homeDefService.returnHomeDefinition().then(function(homeDefinition){
     res.json(homeDefinition);
   })
   .catch(function(error){
     logger.error(error);
     res.send(500);
   });
}
