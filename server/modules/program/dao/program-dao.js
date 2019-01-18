'use strict';

var Program = require('../model/program-model');
var logger = require('../../../services/logger-service')(module);

var programDAO = {
    getAll: getAll,
    create: create,
    update: update,
    remove: remove,
    deleteAll: deleteAll,
    createAll: createAll,
    getProgramsForRoom: getProgramsForRoom,
    deleteAllRoomPrograms: deleteAllRoomPrograms
};

module.exports = programDAO;

function deleteAll() {
    return Program.remove({});
}

function deleteAllRoomPrograms(room) {
    return Program.remove({ room: room });
}

function createAll(programs) {
    var programPromises = programs.map(function(program) {
        return new Program({
            name: program.name,
            isOn: program.isOn,
            hour: program.hour,
            min: program.min,
            frequency: program.frequency,
            storeActions: program.storeActions
        }).save();
    });
    return Promise.all(programPromises);
}

function getProgramsForRoom(room) {
    return Program.find({ room: room });
}

function getAll() {
    return Program.find();
}

function create(name, isOn, hour, minute, frequency, storeActions) {
    var newProgram = new Program({
        name: name,
        isOn: isOn,
        hour: hour,
        minute: minute,
        frequency: frequency,
        storeActions: storeActions
    });
    // save the user
    return newProgram.save();

}

function update(id, newProgram) {
    return Program.findByIdAndUpdate(id, newProgram);
}

function remove(id) {
    return Program.findByIdAndRemove(id);
}