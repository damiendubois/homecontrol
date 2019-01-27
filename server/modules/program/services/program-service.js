'use strict';

var logger = require('../../../services/logger-service')(module);
var programDAO = require('../dao/program-dao');
var rfService = require('../../rf/rf-service');
var nodeSchedule = require('node-schedule');
var musicService = require('../../music/music-service');


var scheduledPrograms = {};

var programService = {
    addProgram: addProgram,
    removeProgram: removeProgram,
    updataProgram: updateProgram,
    scheduleAllPrograms: scheduleAllPrograms,
    updateAllPrograms: updateAllPrograms,
    getAllPrograms: getAllPrograms,
    runProgram: runProgram
};

module.exports = programService;

function getAllPrograms() {
    return programDAO.getAll();
}

function addProgram(program) {
    return programDAO.create(program.name, program.isOn, program.hour, program.min, program.frequency, program.storeActions, program.musicActions, program.plugActions)
        .then(function(dbProgram) {
            scheduleProgram(program);
        });
}

function removeProgram(program) {
    return programDAO.remove(program._id).then(function() {
        unScheduleProgram(program);
    });
}

function updateProgram(program) {
    return programDAO.update(program._id, program).then(function() {
        scheduleProgram(program);
    });
}

function updateAllPrograms(programs) {
    Object.keys(scheduledPrograms).forEach(function(scheduledProgramId) {
        scheduledPrograms[scheduledProgramId].cancel();
    });
    return programDAO.deleteAll()
        .then(function() {
            return programDAO.createAll(programs);
        })
        .then(function() {
            scheduleGivenPrograms(programs);
        });
}


function scheduleGivenPrograms(programs) {
    programs.forEach(function(program) {
        scheduleProgram(program);
    });
}

function scheduleAllPrograms() {
    return programDAO.getAll()
        .then(function(programs) {
            scheduleGivenPrograms(programs);
        });
}

function scheduleProgram(program) {
    unScheduleProgram(program);
    if (program.isOn) {
        scheduledPrograms[program._id] = nodeSchedule.scheduleJob(getProgramSchedule(program), getProgramFunction(program));
    }
}

function unScheduleProgram(program) {
    if (scheduledPrograms[program._id]) {
        scheduledPrograms[program._id].cancel();
    }
}

function runProgram(program) {
    return getProgramFunction(program)();
}

function getProgramFunction(program) {
    return function() {
        var startingTimeOut = 0;
        var timeOutBetweenAction = 1000;
        if (program.storeActions && program.storeActions.length) {
            program.storeActions.forEach(function(storeAction, index) {
                setTimeout(function() {
                    rfService.changeStoreStatus(storeAction.store.code, storeAction.store.plugId, storeAction.action);
                }, index * timeOutBetweenAction);
            });
            startingTimeOut = program.storeActions.length * timeOutBetweenAction;
        }

        if (program.musicActions && program.musicActions.length) {
            program.musicActions.forEach(function(musicAction, index) {
                setTimeout(function() {
                    performMusicAction(musicAction);
                }, startingTimeOut + index * timeOutBetweenAction);
            });
            startingTimeOut += program.musicActions.length * timeOutBetweenAction;
        }

        if (program.plugActions && program.plugActions.length) {
            program.plugActions.forEach(function(plugAction, index) {
                setTimeout(function() {
                    rfService.changePlugStatus(plugAction.plug, plugAction.action);
                }, startingTimeOut + index * timeOutBetweenAction);
            });
            startingTimeOut += program.musicActions.length * timeOutBetweenAction;
        }

    };
}

function performMusicAction(musicAction) {
    if (!musicAction.playlist) {
        musicAction.playlist = "/storage/music/usb/";
    }
    musicService.playPlaylist(musicAction.music.host, musicAction.playlist)
        .then(function() {
            return rfService.changePlugStatus(musicAction.music.plug, "on");
        })
        .catch(function(error) {
            logger.error(error);
        });
    setTimeout(function() {
            musicService.stopMusic(musicAction.music.host);
            rfService.changePlugStatus(musicAction.music.plug, "off");
        },
        musicAction.lastTime * 60000);
}

function getProgramSchedule(program) {
    return "0 " + program.min + " " + program.hour + " * * " + getTimingFrequency(program.frequency) + " ";
}

function getTimingFrequency(frequency) {
    if (!frequency) {
        return "*";
    }
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