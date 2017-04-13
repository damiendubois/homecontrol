(function() {
    'use strict';

    angular.module('app.layout').component('cwtHeaderBar', {
        bindings: {},
        controller: HeaderBarCtrl,
        controllerAs: 'headerBarCtrl',
        templateUrl: 'app/layout/components/header-bar/header-bar.component.html'
    });

    function HeaderBarCtrl(AuthService,$uibModal) {
        var headerBarCtrl = this;
        angular.extend(headerBarCtrl, {
            $onInit: init,
            isUserSet: AuthService.isUserSet,
            getUser: AuthService.getUser,
            openProfil: openProfilPopup,
            logout: logout
        });

        function init() {

        }

        function logout() {
            AuthService.logout();
        }

        function openProfilPopup() {
            var modalInstanceParamaters = {
                animation: true,
                template: '<cwt-profil on-profil-edited="ctrl.closePopup($event)"></cwt-profil>',
                controller: ['$uibModalInstance', function($uibModalInstance) {
                    this.closePopup = function() {
                        $uibModalInstance.close();
                    };
                }],
                controllerAs: 'ctrl',
                size: 'full'
            };
            var modalInstance = $uibModal.open(modalInstanceParamaters);
            modalInstance.result.then(function(editedUser) {}, function() {});
        }

    }

})();