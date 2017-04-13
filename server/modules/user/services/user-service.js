'use strict';

var User = require('../model/user-model');
var logger = require('../../../services/logger-service')(module);
var userDAO = require('../dao/user-dao');

var userService = {
  removeTokenFor: removeTokenFor
};

module.exports = userService;

function removeTokenFor(userName, tokenValue) {

  return userDAO.getByName(userName)
    .then(function(user) {
      if (user) {
        var newTokenList = getTokenListAfterRemovalOfToken(user.connexionTokens,
          tokenValue);
        user.connexionTokens = newTokenList;
        return user;
      }
    });
}

function getTokenListAfterRemovalOfToken(connexionTokens, tokenValue) {
  return connexionTokens.filter(function(token) {
    return token.value !== tokenValue;
  });
}
