'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var ProgramSchema = new Schema({
    name: {
        type: String
    },
    isOn: {
        type: Boolean
    },
    hour: {
        type: Number
    },
    min: {
        type: Number
    },
    frequency: {
        monday: {
            type: Boolean
        },
        tuesday: {
            type: Boolean
        },
        wednesday: {
            type: Boolean
        },
        thursday: {
            type: Boolean
        },
        friday: {
            type: Boolean
        },
        saturday: {
            type: Boolean
        },
        sunday: {
            type: Boolean
        }
    },
    storeActions: [{
        action: String,
        store: {
            label: String,
            code: String,
            plugId: String,
            reversed: Boolean
        }
    }],
    musicActions: [{
        playlist: {
            type: String
        },
        lastTime: {
            type: Number
        },
        music: {
            label: String,
            plug: {
                FMCode: String,
                plugNumber: String
            },
            host: {
                type: String
            }
        }
    }],
    plugActions: [{
        action: String,
        plug: {
            label: String,
            FMCode: String,
            plugNumber: String
        }
    }]
});



module.exports = mongoose.model('Program', ProgramSchema);