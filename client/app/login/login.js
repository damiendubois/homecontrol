(function() {
    'use strict';

    var loginModule = angular.module('app.login', [
        'app.config',
        'ui.bootstrap',
        'ui.router',
        'angularSpinner',
      'vcRecaptcha']);

    /**
     * Route configuration for the RDash module.
     */
    loginModule.config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                // Application routes
                $stateProvider
                    .state('app.login', {
                        url: 'login',
                        template: '<cwt-login-form on-logged="ctrl.onLogged()"></cwt-login-form>',
                        controller: function($state) {
                            this.onLogged = function() {
                                $state.go('app.users');
                            };
                        },
                        controllerAs: 'ctrl',
                        breadcrumb: 'Connection'
                    })
                    .state('app.forgotPassword', {
                        url: 'forgot-password',
                        template: '<cwt-forgot-password on-process-done="ctrl.onProcessDone()"></cwt-forgot-password>',
                        controller: function($state) {
                            this.onProcessDone = function() {
                                $state.go('app.login');
                            };
                        },
                        controllerAs: 'ctrl',
                        breadcrumb: 'Mot de passe oublié'
                    });

            }
        ])
        .run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService) {
            $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
                if (!AuthService.isAuthenticated()) {
                    if (next.name !== 'app.login' && next.name !== 'app.forgotPassword') {
                        event.preventDefault();
                        $state.go('app.login');
                    }
                }else{
                    if (next.name === 'app.login' || next.name === 'app.forgotPassword') {
                        event.preventDefault();
                        $state.go('app.users');
                    }
                }

                if (AuthService.isAuthenticated() && !AuthService.isUserSet()) {
                    AuthService.setUser();
                }

            });
        }]);

})();
