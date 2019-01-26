'use strict';

var logger = require('../../../services/logger-service')(module);
var alarmDAO = require('../dao/alarm-dao');
var rfService = require('../../rf/rf-service');
var musicService = require('../../music/music-service');
var nodeSchedule = require('node-schedule');


var scheduledAlarms = {};

var alarmService = {
    addAlarm: addAlarm,
    removeAlarm: removeAlarm,
    updataAlarm: updateAlarm,
    scheduleAllAlarms: scheduleAllAlarms,
    updateAllAlarms: updateAllAlarms,
    getAllAlarms: getAllAlarms,
    getAlarmsForRoom: getAlarmsForRoom,
    updateAllAlarmsForRoom: updateAllAlarmsForRoom
};

module.exports = alarmService;

function getAllAlarms() {
    return alarmDAO.getAll();
}

function getAlarmsForRoom(roomId) {
    return alarmDAO.getAlarmsForRoom(roomId);
}

function addAlarm(alarm) {
    return alarmDAO.create(alarm.name, alarm.isOn, alarm.hour, alarm.min, alarm.frequency, alarm.music, alarm.store)
        .then(function(dbAlarm) {
            scheduleAlarm(alarm);
        });
}

function removeAlarm(alarm) {
    return alarmDAO.remove(alarm._id).then(function() {
        unScheduleAlarm(alarm);
    });
}

function updateAlarm(alarm) {
    return alarmDAO.update(alarm._id, alarm).then(function() {
        scheduleAlarm(alarm);
    });
}

function updateAllAlarms(alarms) {
    Object.keys(scheduledAlarms).forEach(function(scheduledAlarmId) {
        scheduledAlarms[scheduledAlarmId].cancel();
    });
    return alarmDAO.deleteAll()
        .then(function() {
            return alarmDAO.createAll(alarms);
        })
        .then(function() {
            scheduleGivenAlarms(alarms);
        });
}

function updateAllAlarmsForRoom(alarms, room) {
    Object.keys(scheduledAlarms).forEach(function(scheduledAlarmId) {
        if (scheduledAlarms[scheduledAlarmId]) {
            scheduledAlarms[scheduledAlarmId].cancel();
        }
    });
    return alarmDAO.deleteAllRoomAlarms(room)
        .then(function() {
            return alarmDAO.createAll(alarms);
        })
        .then(function() {
            scheduleAllAlarms(alarms);
        });
}

function scheduleGivenAlarms(alarms) {
    alarms.forEach(function(alarm) {
        scheduleAlarm(alarm);
    });
}

function scheduleAllAlarms() {
    return alarmDAO.getAll()
        .then(function(alarms) {
            scheduleGivenAlarms(alarms);
        });
}

function scheduleAlarm(alarm) {
    unScheduleAlarm(alarm);
    if (alarm.isOn) {
        scheduledAlarms[alarm._id] = nodeSchedule.scheduleJob(getAlarmSchedule(alarm), getAlarmFunction(alarm));
    }
}

function unScheduleAlarm(alarm) {
    if (scheduledAlarms[alarm._id]) {
        scheduledAlarms[alarm._id].cancel();
    }
}

function getAlarmFunction(alarm) {
    return function() {
        if (alarm.store && alarm.store.isOn) {
            rfService.changeStoreStatus(54791, 1, "up");
        }
        setTimeout(function() {
            if (alarm.music && alarm.music.isOn) {
                if (!alarm.music.playlist) {
                    alarm.music.playlist = "/storage/music/usb/";
                }
                musicService.playPlaylist(alarm.music.host, alarm.music.playlist)
                    .then(function() {
                        return rfService.changePlugStatus(alarm.music.plug, "on");
                    })
                    .catch(function(error) {
                        logger.error(error);
                    });
            }
        }, 30000);

        setTimeout(function() {
                musicService.stopMusic(alarm.music.host);
                rfService.changePlugStatus(alarm.music.plug, "off");
            },
            alarm.music.lastTime * 60000);
    };
}



function getAlarmSchedule(alarm) {
    return "0 " + alarm.min + " " + alarm.hour + " * * " + getTimingFrequency(alarm.frequency) + " ";
}

function getTimingFrequency(frequency) {
    var crontabFrequency = "";
    var firstFound = true;
    var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (var i = 0; i < days.length; i++) {
        if (frequency[days[i]]) {
            if (!firstFound) {
                crontabFrequency += ",";
            }
            firstFound = false;
            crontabFrequency += i;
        }
    }
    if (crontabFrequency === "") {
        return "*";
    }
    return crontabFrequency;

}