'use strict';
//execute commands
var rfService = require('./rf-service');
var logger = require('../../services/logger-service')(module);

var rfController = {
  changeStatus : changeStatus,
  changeStoreStatus : changeStoreStatus
};

module.exports = rfController;

function changeStatus (req, res) {
 rfService.changePlugStatus(req.body.plug,req.body.status).then(function(){
   res.status(200);
 }).catch(function(error){
    res.status(500);
   logger.error(error);
 });

}

function changeStoreStatus(req, res){
  rfService(req.body.code,req.body.plugId,req.body.action).then(function(){
    res.send(200);
  })
  .catch(function(error){
    res.status(500);
    logger.error(error);
  });
}
