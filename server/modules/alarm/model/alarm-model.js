'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var AlarmSchema = new Schema({
    room:{
      type: String
    },
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
      monday : {
        type: Boolean
      },
      tuesday : {
        type: Boolean
      },
      wednesday : {
        type: Boolean
      },
      thursday : {
        type: Boolean
      },
      friday : {
        type: Boolean
      },
      saturday : {
        type: Boolean
      },
      sunday : {
        type: Boolean
      }
    },
    music: {
      isOn: {
        type: Boolean
      },
      host : {
        type: String
      },
      playlist: {
        type: String
      },
      lastTime : {
        type: Number
      },
      plug: {
        FMCode:String,
        plugNumber:String
      }
    },
    store : {
      isOn : {
        type: Boolean
      }
    }

});



module.exports = mongoose.model('Alarm', AlarmSchema);
