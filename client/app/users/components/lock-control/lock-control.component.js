(function() {
    'use strict';

  angular.module('app.users').component('userLockControl', {
    bindings: {
      lock: '<'
    },
    controller: UserLockControlCtrl,
    controllerAs: 'userLockControlCtrl',
    templateUrl: 'app/users/components/lock-control/lock-control.component.html'
  });

  function UserLockControlCtrl(UserService) {
      var userLockControlCtrl =this;

      angular.extend(userLockControlCtrl,{
        $onInit : onInit,
        toggleSuspendButton : toggleSuspendButton,
        lock : userLockControlCtrl.lock ? userLockControlCtrl.lock : {},
        unlock : unlock
      });

      function onInit(){
        userLockControlCtrl.lock.adminUnlocked = !userLockControlCtrl.lock.adminLock;
        if(userLockControlCtrl.lock.lockUntil){
          userLockControlCtrl.lock.lockUntil = new Date(userLockControlCtrl.lock.lockUntil);
          userLockControlCtrl.lock.lockingTime = new Date(userLockControlCtrl.lock.lockingTime);
          userLockControlCtrl.lock.isLocked = userLockControlCtrl.lock.lockUntil >= new Date();
        }else{
          userLockControlCtrl.lock.isLocked = false;
        }

      }

      function toggleSuspendButton($event){
            userLockControlCtrl.lock.adminLock = !userLockControlCtrl.lock.adminLock;
      }

      function unlock(){
        userLockControlCtrl.lock.isLocked = false;
        userLockControlCtrl.lock.lockUntil = new Date();
      }


  }

})();
