'use strict';

var Alarm = require('../model/alarm-model');
var logger = require('../../../services/logger-service')(module);

var alarmDAO = {
  getAll: getAll,
  create: create,
  update: update,
  remove: remove,
  deleteAll:deleteAll,
  createAll:createAll,
  getAlarmsForRoom:getAlarmsForRoom,
  deleteAllRoomAlarms:deleteAllRoomAlarms
};

module.exports = alarmDAO;

function deleteAll(){
  return Alarm.remove({});
}
function deleteAllRoomAlarms(room){
  return Alarm.remove({room:room});
}
function createAll(alarms){
  var alarmPromises = alarms.map(function(alarm){
    return new Alarm({
      name: alarm.name,
      isOn: alarm.isOn,
      hour: alarm.hour,
      min: alarm.min,
      frequency : alarm.frequency,
      music:alarm.music,
      store:alarm.store,
      room:alarm.room
    }).save();
  });
  return Promise.all(alarmPromises);
}

function getAlarmsForRoom(room){
  return Alarm.find({room: room});
}

function getAll() {
  return Alarm.find();
}

function create(name, isOn, hour, minute, frequency,music,store,room) {
  var newAlarm = new Alarm({
    name: name,
    isOn: isOn,
    hour: hour,
    minute: minute,
    frequency : frequency,
    music:music,
    store:store,
    room:room
  });
  // save the user
  return newAlarm.save();

}

function update(id, newAlarm) {
  return Alarm.findByIdAndUpdate(id, newAlarm);
}

function remove(id) {
  return Alarm.findByIdAndRemove(id);
}
