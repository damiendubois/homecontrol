(function() {
    'use strict';

  angular.module('app.users').component('userEdition', {
    bindings: {
      user: '<',
      onUpdate: '&'
    },
    controller: UserEditionCtrl,
    controllerAs: 'userEditionCtrl',
    templateUrl: 'app/users/components/user-edition/user-edition.component.html'
  });

  function UserEditionCtrl(UserService) {
      var userEditionCtrl =this;
      angular.extend(userEditionCtrl,{
        saveUser : saveUser,
        endUpdate : endUpdate,
        $onInit : onInit
      });

      function onInit(){
        if(!userEditionCtrl.user){
            userEditionCtrl.user = {
            lock : {}
          };
        }
        if(!userEditionCtrl.user.lock){
          userEditionCtrl.user.lock = {};
        }
      }

      function saveUser(){
          if(userEditionCtrl.userForm.$valid){
              if(userEditionCtrl.user._id){
                  UserService.saveUser(userEditionCtrl.user).then(function(result){
                    userEditionCtrl.endUpdate();
                  });
              }else{
                  UserService.createUser(userEditionCtrl.user).then(function(result){
                      userEditionCtrl.endUpdate();
                  });
              }
          }
      }

      function endUpdate(){
        userEditionCtrl.onUpdate(
            {
            $event: {
              user: userEditionCtrl.user
            }
          });
      }
  }

})();
