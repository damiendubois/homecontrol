(function() {
    'use strict';

    angular.module('app.users',
        ['app.config',
        'ui.bootstrap',
        'ui.router',
        'ngTable',
        'ui.toggle'
        ]);

    /**
     * Route configuration for the RDash module.
     */
    angular.module('app.users').config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // Application routes
            $stateProvider
                .state('app.users',
                    {
                        url: 'users',
                        template: '<ui-view/>'
                    }
                )
                .state('app.users.list',
                    {
                        url: '/list',
                        template: '<user-list users="ctrl.users"></user-list>',
                        controller: function(users) {
                            this.users = users;
                        },
                        controllerAs: 'ctrl',
                        resolve: {
                            users: function(UserService) {
                                return UserService.getUserList();
                            }
                        },
                        breadcrumb: 'Liste des utilisateurs'
                    }
                )
                .state('app.users.edition',
                    {
                        url: 'edition/:id',
                        controller: function($state,user) {
                            this.user=user;
                            this.goToUserList= function(event){
                                $state.go("app.users.list");
                            };
                        },
                        resolve: {
                            user: function(UserService,$stateParams) {
                                if($stateParams.id){
                                    return UserService.getUser($stateParams.id);
                                }
                                return null;
                            }
                        },
                        breadcrumb: 'Édition d\'utilisateur',
                        controllerAs: 'ctrl',
                        templateUrl: 'app/users/users.html'
                    }
                );
        }
    ]);
})();
