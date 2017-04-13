(function() {
    'use strict';

    angular.module('app')
        .controller('LayoutCtrl', ['$scope', 'usSpinnerService', LayoutCtrl]);

    function LayoutCtrl($scope, usSpinnerService) {
        var layoutCtrl = this;
        angular.extend(layoutCtrl, {
            toggle: true,
            onSidebarToggle: onSidebarToggle
        });

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.resolve) {
                usSpinnerService.spin('spinner-content');
            }
        });
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.resolve) {
                usSpinnerService.stop('spinner-content');
            }
        });

        function onSidebarToggle(event) {
            layoutCtrl.toggle = event.sidebarOpened;
        }

    }

})();
