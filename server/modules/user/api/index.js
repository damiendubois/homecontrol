'use strict';

var express = require('express');
var router = express.Router();
var anyUser = require('./user-controller');
var loggedUser = require('./logged-user-controller');
var loggingService = require('../services/logging-service');
var capthcaService = require('../../../services/captcha-service');

//retrieve the list of all users
router.get('/existing/', loggingService.checkPermission(['employee','admin']), anyUser.index);
//retrieve the user
router.get('/existing/:id', loggingService.checkPermission('admin'), anyUser.retrieve);
//create a new user
router.put('/existing/', loggingService.checkPermission('admin'),anyUser.create);
//update a user
router.post('/existing/:id', loggingService.checkPermission('admin'),anyUser.update);
//delete an existing user
router.delete('/existing/:id', loggingService.checkPermission('admin'),anyUser.destroy);
//reset password
router.post('/reset/',capthcaService.checkCaptcha(), anyUser.resetPassword);


//create the logged user
router.post('/logged/', loggedUser.create);
//return the logged user
router.get('/logged/' , loggingService.checkLogged() ,loggedUser.retrieve);
//return the logged user details
router.get('/logged/details' , loggingService.checkLogged() ,loggedUser.retrieveDetails);
//update the logged user details
router.post('/logged/details' , loggingService.checkLogged() ,loggedUser.updateDetails);
//logout the logged user
router.delete('/logged/', loggingService.checkLogged() ,loggedUser.destroy);

module.exports = router;
