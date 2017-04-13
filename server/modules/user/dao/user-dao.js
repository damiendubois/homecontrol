'use strict';

var User = require('../model/user-model');
var logger = require('../../../services/logger-service')(module);

var userDAO = {
  getById: getById,
  getByName: getByName,
  getAll: getAll,
  create: create,
  update: update,
  updateByName:updateByName,
  remove: remove
};

module.exports = userDAO;

function getById(userId) {
  return User.findById(userId, {
    "name": true,
    "permissions": true,
    "email": true,
    "lock": true,
    "connexionTokens":true
  });
}

function getByName(userName) {
  return User.findOne({
    name: userName
  });
}

function getAll() {
  return User.find({}, {
    "name": true,
    "permissions": true,
    "email": true,
    "lock": true
  });
}

function create(name, password, email, permissions, lock) {
  var newUser = new User({
    name: name,
    password: password,
    email: email,
    permissions: permissions,
    lock : lock
  });
  // save the user
  return newUser.save();

}

function update(id, newUser) {
  return User.findByIdAndUpdate(id, newUser);
}

function updateByName(name, newUser){
  return User.findOneAndUpdate({name:name}, newUser);
}

function remove(id) {
  return User.findByIdAndRemove(id);
}
