(function() {
    'use strict';

    angular.module('cwt.gui').filter('cwtMoney', function() {
        return function(amount) {
          if(!amount){
            return '0 €';
          }
            return amount + ' €'  ;
        };
    });


})();
