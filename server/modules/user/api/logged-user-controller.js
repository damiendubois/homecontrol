'use strict';
//TODO CLEAN THAT SHIT : remove all references to user model and replace with DAO
var User = require('../model/user-model');
var loggingService = require('../services/logging-service');
var userDAO = require('../dao/user-dao');
var handleError = require('../../../services/mongo-express-error-service').handleError;

exports.retrieve = function(req, res) {
  if (!req.loggedUser) {
    return res.status(401).json({
      success: false,
      msg: 'user not logged'
    });
  }
  return res.status(200).json({
    success: true,
    user: req.loggedUser
  });

};

exports.retrieveDetails = function(req, res) {
  if (!req.loggedUser) {
    return res.status(401).json({
      success: false,
      msg: 'user not logged'
    });
  }
  userDAO.getById(req.loggedUser.id)
    .then(function(user) {
      return res.status(200).json(user);
    })
    .catch(function(error) {
      handleError(res, error);
    });
};

exports.updateDetails = function(req, res) {
  if (!req.loggedUser) {
    return res.status(401).json({
      success: false,
      msg: 'user not logged'
    });
  }

  //checkPassword
  if (req.body.password === "" || req.body.email === "") {
    return res.status(404).json({
      success: false,
      msg: 'Invalid arguments'
    });
  }


  User.findById(req.loggedUser.id)
    .then(function(user){
        return user.comparePasswordPromise(req.body.password);
    })
    .then( function(user){
        if(!user.passwordMatch){
          return res.status(404).json({
            success: false,
            msg: 'Invalid arguments'
          });
        }
        //password match
        if (req.body.newPassword) {
          user.password = req.body.newPassword;
        }
        if (req.body.email) {
          user.email = req.body.email;
        }
        if (req.body.connexionTokens) {
          user.connexionTokens = getNewTokenList(user.connexionTokens,
            req.body.connexionTokens);
        }
        return user.save();
    })
    .then( function(user) {
      if (!tokenExist(req.loggedUser.token, user.connexionTokens)) {
        return res.status(401).send({
          success: true,
          msg: 'Your active session has been deleted'
        });
      }
      return res.status(200).json({
        success: true,
        msg: 'Successful edition of profile.'
      });
    })
   .catch(function(error) {
      return handleError(res, error);
    });

};

exports.destroy = function(req, res) {
  if (!req.loggedUser) {
    return res.status(401).json({
      success: false,
      msg: 'user not logged'
    });
  }
  User.findById(req.loggedUser.id)
    .then( function(user){
    if (!user) {
      throw new Error({msg:"user to logout not found in db"});
    }
    var newTokenList = getTokenListAfterRemovalOfToken(user.connexionTokens, req.loggedUser.token);
    user.connexionTokens = newTokenList;
    return user.save();
  })
  .then(function(user){
    res.status(200).json({
      success: true,
      msg: 'Successful logged out.'
    });
  })
  .catch(function(error){
    return handleError(res, error);
  });
};

exports.create = function(req, res) {
  loggingService.logUser(req, res);
};

function getTokenListAfterRemovalOfToken(connexionTokens, token) {
  for (var i = 0; i < connexionTokens.length; i++) {
    if (connexionTokens[i].value == token) {
      return connexionTokens.splice(i, 1);
    }
  }
  return connexionTokens;
}

function getNewTokenList(databaseTokenList, uiTokenList) {
  var newTokenList = [];
  for (var i = 0; i < databaseTokenList.length; i++) {
    var toBeAdded = true;
    var token = databaseTokenList[i];
    for (var j = 0; j < uiTokenList.length; j++) {
      if (uiTokenList[j]._id == token._id && uiTokenList[j].deleted) {
        toBeAdded = false;
        break;
      }
    }
    if (toBeAdded) {
      newTokenList.push(token);
    }
  }
  return newTokenList;
}

function tokenExist(token, tokenList) {
  for (var i = 0; i < tokenList.length; i++) {
    if (tokenList[i].value == token) {
      return true;
    }
  }
  return false;
}
