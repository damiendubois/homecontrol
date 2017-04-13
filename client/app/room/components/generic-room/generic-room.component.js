(function() {
    'use strict';

  angular.module('app.rooms').component('genericRoom', {
    bindings: {
      roomId : '<'
    },
    controller: GenericRoomCtrl,
    controllerAs: 'genericRoomCtrl',
    templateUrl: 'app/room/components/generic-room/generic-room.component.html'
  });

  function GenericRoomCtrl(HomeDefinitionService,RFService) {
      var genericRoomCtrl =this;

      angular.extend(genericRoomCtrl,{
        $onInit : onInit,
        configuration  : {},
        actionStore:RFService.actionStore,
        switchPlug:RFService.switchPlug
      });

      function onInit(){
        HomeDefinitionService.getRoomConf(genericRoomCtrl.roomId).then(function(roomconf){
          genericRoomCtrl.configuration = roomconf;
        });
      }

  }

})();
