(function() {
    'use strict';

  angular.module('app.users').factory('UserService',
    function($http,serverBaseUrl,Notice,$q,$filter,CacheService) {

      var cacheExpirationTime = 180;
      var pathToUsers = '/user/existing/';

        var UserService = {
          createUser: createUser,
          saveUser : saveUser,
          deleteUser : deleteUser,
          getUserList : getUserList,
          getUser : getUser
        };

        function createUser(user) {
          return $http.put(serverBaseUrl + pathToUsers, user)
          .then(function(result){
            var createdUser=  {
                name: user.name,
                password : user.password,
                email: user.email,
                permissions: user.permissions,
                _id: result.data.id
            };
            Notice.info("L'utilisateur "+user.name+" a bien été créé." );
            CacheService.addElementInCachedArray(pathToUsers,createdUser);
            return createdUser;
          })
          .catch(handleError);
        }

        function saveUser(user) {
          return $http.post(serverBaseUrl + pathToUsers+user._id, user)
          .then(function(result){
            Notice.info("L'utilisateur "+user.name+"  a bien été édité.");
            CacheService.updateElementInCachedArray(pathToUsers,user);
            return user;
          })
          .catch(handleError);
        }

        function deleteUser(user) {
          return $http.delete(serverBaseUrl + pathToUsers+user._id, {})
          .then(function(result){
            Notice.info("L'utilisateur "+user.name+"  a bien été supprimé.");
            CacheService.removeElementInCachedArray(pathToUsers,user);
            return result.data;
          })
          .catch(handleError);
        }

        function getUserList(bypassCache) {
          var userListPromise;
          if (CacheService.isResourceValid(pathToUsers) && !bypassCache){
            userListPromise = CacheService.getResource(pathToUsers);
          }else{
            userListPromise =  $http.get(serverBaseUrl + pathToUsers, {})
              .then(function (result){
                if(result.data){
                  CacheService.setResource(pathToUsers, result.data, cacheExpirationTime);
                  return result.data;
                }
              });
          }
          return userListPromise
            .then(function (users){
                 users.forEach(function(user){
                  if(user.lock && user.lock.lockUntil){
                     user.lock.lockUntil = new Date(user.lock.lockUntil);
                     if(user.lock.lockUntil >= new Date()){
                       user.lock.isLocked = true;
                     }
                   }
                });
                return users;
              })
            .catch(handleError);
        }


        function getUser(userId) {
          return $http.get(serverBaseUrl + pathToUsers +userId, {})
          .then(function (result){
            return result.data;
          })
          .catch(handleError);
        }

        function handleError(error){
          if(error.status==-1){
            Notice.error("Votre connexion internet a été interrompu.");
          }
          if(error.status==500){
            Notice.error("Une erreur s'est produite, veuillez contacter vos administrateurs.");
          }
          if(error.status==404 ){
            Notice.error("Il y a eu un problème avec votre demande. Veuillez verifier vos données.");
          }
          if(error.status==409){
            Notice.error("Cet utilisateur existe déjà. Merci de modifier le nom que vous avez choisi.");
          }
            if(error.status==423){
              Notice.error('Cet utilisateur est bloqué.');
            }
            if(error.status==401){
              Notice.error('Votre session est expirée.');
            }

            return $q.reject(error);
        }

        return UserService;

    }

  );
})();
