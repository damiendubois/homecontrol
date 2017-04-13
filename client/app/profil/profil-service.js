'use strict';

angular.module('app.profil').factory('ProfilService',
  function($http,serverBaseUrl,Notice,$q,$filter,CacheService) {

      var UserService = {};

      UserService.updateAuthenticatedUserDetails = function(user) {
        return $http.post(serverBaseUrl + '/user/logged/details', user).then(function(result){
          CacheService.invalidResource('/user/existing/');
          Notice.info("Le profil a bien été édité");
          return user;
        })
        .catch(function(error){
          if(error.status==500){
            Notice.error("Une erreur s'est produite, veuillez contacter vos administrateurs.");
          }
          if(error.status==404 ){
            Notice.error("Merci de verifier le mot de passe saisi.");
          }
          if(error.status==409){
            Notice.error("Ce nom d'utilisateur existe déjà. Merci de modifier le nom que vous avez choisi.");
          }
          return $q.reject(error);
        });
      };

      UserService.getAuthenticatedUserDetails= function(userId) {
        return $http.get(serverBaseUrl + '/user/logged/details', {}).then(function (result){
          return result.data;
        })
        .catch(function (error){
          Notice.error("Une erreur s'est produite, veuillez contacter vos administrateurs.");
        });
      };

      return UserService;

  }

);
