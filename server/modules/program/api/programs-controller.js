'use strict';

//execute commands

var programService = require('../services/program-service');


var programs = [];


var programController = {
    get: get,
    editAll: editAll,
    runProgram: runProgram
};


module.exports = programController;


function editAll(req, res) {
    programService.updateAllPrograms(req.body.programs).then(function() {
        res.status(200).json({});
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({});
    });
}

function runProgram(req, res) {
    try {
        programService.runProgram(req.body.program);
        res.status(200).json({});
    } catch (e) {
        console.log(error);
        res.status(500).json({});
    }

}

function get(req, res) {
    programService.getAllPrograms().then(function(programs) {
        res.status(200).json(programs);
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({});
    });
}