(function() {
    'use strict';

    angular.module('app.login').factory('AuthInterceptor', ['$injector', '$rootScope', '$q','usSpinnerService',
            function($injector, $rootScope, $q,usSpinnerService) {
                return {
                    responseError: function(response) {
                        if (response.status == 401 || response.status == 423) {

                            var authService = $injector.get('AuthService');
                            authService.destroySessionToken();
                            var state = $injector.get('$state');
                            state.go('app.login');
                            usSpinnerService.stop('spinner-content');

                        }
                        return $q.reject(response);
                    }
                };
            }
        ])
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        });
})();
