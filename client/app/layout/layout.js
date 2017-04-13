'use strict';

angular.module('app.layout', [
    'ui.bootstrap',
    'app.login',
    'app.profil'
    ]);



angular.module('app.layout').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // Application routes
        $stateProvider
            .state('app', {
                url: '/',
                templateUrl: 'app/layout/layout.tpl.html',
                controller: 'LayoutCtrl',
                controllerAs: 'layoutCtrl',
                resolve: {
                  homeDefinition : function(HomeDefinitionService){
                    return HomeDefinitionService.getHomeDefinition();
                  }
                }
            });

        // For unmatched routes
        $urlRouterProvider.otherwise('/users');
    }
]);
