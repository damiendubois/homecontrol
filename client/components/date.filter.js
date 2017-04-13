(function() {
    'use strict';

    angular.module('cwt.gui').filter('cwtDate', function($filter) {
        return function(date) {
            return $filter('date')(date, 'dd/MM/yyyy');
        };
    });

    angular.module('cwt.gui').filter('cwtDateTime', function($filter) {
        return function(date) {
            return $filter('date')(date, 'dd/MM/yyyy HH:mm');
        };
    });


})();
