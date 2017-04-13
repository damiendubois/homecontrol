(function() {
    'use strict';

    angular.module('cwt.gui').filter('cwtAddress', function($filter) {
        return function(customer) {
            var address = "";
            if(angular.isDefined(customer.address)){
                address = customer.address + ' ';
            }
            if (angular.isDefined(customer.zipCode)) {
                address += customer.zipCode + ' ';
            }
            if (angular.isDefined(customer.city)) {
                address += customer.city + ' ';
            }
            if (angular.isDefined(customer.country)) {
                address += $filter('translate')('countryPicker.countries.' + customer.country) + ' ';
            }
            return address;
        };
    });


})();
