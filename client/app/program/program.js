(function() {
    'use strict';

    angular.module('app.programs', ['app.config',
        'ui.bootstrap',
        'ui.router',
        'app.rooms'
    ]);

    /**
     * Route configuration for the RDash module.
     */
    angular.module('app.programs').config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // Application routes
            $stateProvider
                .state('app.programs', {
                    url: 'program/',
                    template: '<program-setup></program-setup>',
                    breadcrumb: 'Reveil et programmes',
                    controllerAs: 'ctrl',
                    controller: function() {}
                });
        }
    ]);
})();