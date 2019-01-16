'use strict';

//execute commands

var programService = require('../services/program-service');


var programs = [];


var programController = {
    get: get,
    editAll: editAll
};


module.exports = programController;


function editAll(req, res) {
    programService.updateAllProgramsForRoom(req.body.programs, req.params.roomId).then(function() {
        res.status(200).json({});
    }).catch(function(error) {
        res.status(500);
    });
}

function get(req, res) {
    programService.getProgramsForRoom(req.params.roomId).then(function(programs) {
        res.status(200).json(programs);
    }).catch(function(error) {
        res.status(500);
    });
}