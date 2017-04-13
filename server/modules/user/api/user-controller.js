'use strict';

var jsonUtil = require('../../../util/json-object-util');
var userService = require('../services/user-service');
var userDAO = require('../dao/user-dao');
var handleError = require('../../../services/mongo-express-error-service').handleError;
var emailService = require('../../../services/email-service');
exports.retrieve = function(req, res) {
  userDAO.getById(req.params.id)
    .then(function(user) {
      res.status(200).json(user);
    })
    .catch(function(error) {
      handleError(res, error);
    });
};

exports.index = function(req, res) {
  userDAO.getAll()
    .then(function(users) {
      res.status(200).json(users);
    })
    .catch(function(error) {
      handleError(res, error);
    });
};


exports.create = function(req, res) {
  if (!req.body.name || !req.body.password || !req.body.email || !req.body.permissions ||
    req.body.name === "" || req.body.password === "" || req.body.email === "" ||
    req.body.permissions === []) {
    return res.status(404).json({
      success: false,
      msg: 'Invalid arguments'
    });
  }

  userDAO.create(req.body.name, req.body.password, req.body.email,
      req.body.permissions, req.body.lock)
    .then(function(user) {
      res.status(200).json({
        success: true,
        msg: 'Successful created new user.',
        id: user.id
      });
    })
    .catch(function(error) {
      handleError(res, error);
    });

};

exports.update = function(req, res) {
  if (req.body.name === "" || req.body.password === "" || req.body.email ===
    "" || req.body.permissions === []) {
    return res.status(404).json({
      success: false,
      msg: 'Invalid arguments'
    });
  }
  userDAO.update(req.params.id, req.body)
    .then(function() {
      res.status(200).json({
        success: true,
        msg: 'Successful edited user.'
      });
    })
    .catch(function(error) {
      handleError(res, error);
    });
};

exports.destroy = function(req, res) {
  userDAO.remove(req.params.id)
    .then(function() {
      res.status(200).json({
        success: true,
        msg: 'Successful deleted user.'
      });
    })
    .catch(function(error) {
      handleError(res, error);
    });
};

exports.resetPassword = function(req, res) {
  var newPassword  = generateNewPassword();
  var newUser = { password : newPassword };
  userDAO.getByName(req.body.name)
    .then(function(user){
      if(user){
        user.password=newPassword;
      }
      return user.save();
    })
  .then(function(user){
    if(user && user.email){
      return emailService.sendEmail(
        'homecontrol',
        [user.email],
        'Nouveau mot de passe',
        'Votre nouveau mot de passe est : '+newPassword
      );
    }
  })
  .then(function(){
    res.status(200).json({
      success: true,
    });
  })
  .catch(function(error){
    res.status(200).json({
      success: false
    });
  });
};

function generateNewPassword(len){
  var length = (len)?(len):(10);
  var string = "abcdefghijklmnopqrstuvwxyz"; //to upper
  var numeric = '0123456789';
  var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  var password = "";
  var character = "";
  var crunch = true;
  while( password.length<length ) {
      var entity1 = Math.ceil(string.length * Math.random()*Math.random());
      var entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
      var entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
      var hold = string.charAt( entity1 );
      hold = (entity1%2===0)?(hold.toUpperCase()):(hold);
      character += hold;
      character += numeric.charAt( entity2 );
      character += punctuation.charAt( entity3 );
      password = character;
  }
  return password;
}
