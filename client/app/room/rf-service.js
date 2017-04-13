(function() {
    'use strict';

  angular.module('app.users').factory('RFService',
    function($http,serverBaseUrl,Notice) {

      var pathToRf = '/rf/';

        var RFService = {
          switchPlug: switchPlug,
          actionStore: actionStore
        };

        function switchPlug(plug,status) {
          return $http.put(serverBaseUrl + pathToRf + 'plug', { plug : plug , status: status})
          .then(function(result){
            Notice.info("Plug " + status );
          })
          .catch(function(error){
            Notice.error("Impossible to perform action");
          });
        }

        function actionStore(store,action) {
          return $http.put(serverBaseUrl + pathToRf + 'store', { action : action , plugId: store.plugId, code: store.code})
          .then(function(result){
            Notice.info("Store " + action );
          })
          .catch(function(error){
            Notice.error("Impossible to perform action");
          });
        }


        return RFService;

    }

  );
})();
