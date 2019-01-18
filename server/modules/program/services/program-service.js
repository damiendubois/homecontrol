'use strict';

var logger = require('../../../services/logger-service')(module);
var programDAO = require('../dao/program-dao');
var rfService = require('../../rf/rf-service');
var nodeSchedule = require('node-schedule');


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
    return programDAO.create(program.name, program.isOn, program.hour, program.min, program.frequency, program.storeActions)
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
        if (program.storeActions && program.storeActions.length) {
            program.storeActions.forEach(function(storeAction, index) {
                var timeOutBetweenAction = 500;
                setTimeout(function() {
                    rfService.changeStoreStatus(storeAction.store.code, storeAction.store.plugId, storeAction.action);
                }, index * timeOutBetweenAction);
            });

        }
    };
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