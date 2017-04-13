/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../modules/user/model/user-model');
var logger = require('../services/logger-service')(module);
var alarmService = require('../modules/alarm/services/alarm-service');

User.find({name:'admin'},{},function (err, users) {
      if(users.length===0){
        User.create(
          {name : 'admin',permissions:["admin"],password:"password",email:"dubois.dam@gmail.com"},
          function () {
            logger.info('User admin created');
          });
      }else{
        logger.info('User admin already exists');
      }
  });

alarmService.scheduleAllAlarms();
