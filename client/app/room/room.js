(function() {
    'use strict';

    angular.module('app.rooms',
        ['app.config',
        'ui.bootstrap',
        'ui.router'
        ]);

    /**
     * Route configuration for the RDash module.
     */
    angular.module('app.rooms').config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // Application routes
            $stateProvider
                .state('app.rooms',
                    {
                        url: 'rooms/:id',
                        template: '<generic-room room-id="ctrl.roomId"></generic-room>',
                        breadcrumb: 'Contrôle de pièce',
                        controllerAs: 'ctrl',
                        controller : function($stateParams){
                          this.roomId = $stateParams.id;
                        }
                    }
                );
        }
    ]);
})();
