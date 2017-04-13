(function() {
    'use strict';

  angular.module('app.users').factory('AlarmService',
    function($http,serverBaseUrl,Notice) {

      var pathToAlarm = '/alarm/';

        var AlarmService = {
            getAlarmsForRoom : getAlarmsForRoom,
            saveAlarms : saveAlarms
        };

        function getAlarmsForRoom(roomId) {
          return $http.get(serverBaseUrl + pathToAlarm +roomId )
          .then(function(result){
            return result.data;
          })
          .catch(function(error){
            Notice.error("Impossible to retrieve alarms");
          });
        }

        function saveAlarms(alarms,roomId) {
          return $http.put(serverBaseUrl + pathToAlarm + roomId , { alarms :alarms})
          .then(function(result){
            Notice.info("alarms saved " );
          })
          .catch(function(error){
            Notice.error("Impossible to save alarms");
          });
        }


        return AlarmService;

    }

  );
})();
