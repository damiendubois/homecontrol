(function() {
    'use strict';

  angular.module('app.users').component('alarm', {
    bindings: {
      room : '<'
    },
    controller: AlarmCtrl,
    controllerAs: 'alarmCtrl',
    templateUrl: 'app/room/components/alarm/alarm.component.html'
  });

  function AlarmCtrl(AlarmService) {
      var alarmCtrl =this;

      angular.extend(alarmCtrl,{
        $onInit : onInit,
        addAlarm:addAlarm,
        saveAlarms:saveAlarms,
        removeAlarm:removeAlarm,
        alarms: []
      });

      function addAlarm(){
        var newAlarm = {
          name:'New alarm',
          isOn:true,
          hour:8,
          min:0,
          frequency:{},
          music : {
            host:'chambre.local',
            playlist:'',
            lastTime:5,
            isOn : true
          },
          store : {
            isOn : true
          },
          room:alarmCtrl.room.id
        };
        alarmCtrl.alarms.push(newAlarm);
      }

      function saveAlarms(){
        AlarmService.saveAlarms(alarmCtrl.alarms,alarmCtrl.room.id);
      }

      function removeAlarm(alarmToBeRemoved){
        alarmCtrl.alarms = alarmCtrl.alarms.filter(function(alarm){
          return alarmToBeRemoved!==alarm;
        });
      }

      function onInit(){
        AlarmService.getAlarmsForRoom(alarmCtrl.room.id).then(function(alarms){
          alarmCtrl.alarms = alarms;
        });
      }

  }

})();
