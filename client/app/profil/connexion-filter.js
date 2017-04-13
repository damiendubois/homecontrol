(function() {
    'use strict';

    angular.module('app.profil').filter('connexionFilter', function() {

        return function(connexions) {
            if (connexions) {
                var filteredConnexions = [];
                for (var i = 0; i < connexions.length; i++) {
                    if (!connexions[i].deleted) {
                        filteredConnexions.push(connexions[i]);
                    }
                }
                return filteredConnexions;
            }
            return [];
        };
    });

})();
