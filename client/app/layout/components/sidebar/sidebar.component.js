(function() {
    'use strict';

    angular.module('app.layout').component('cwtSidebar', {
        bindings: {
            onToggle: '&'
        },
        controller: SidebarCtrl,
        controllerAs: 'sidebarCtrl',
        templateUrl: 'app/layout/components/sidebar/sidebar.component.html'
    });

    function SidebarCtrl($scope, AuthService, $state, HomeDefinitionService, $stateParams) {
        var mobileView = 992;
        var sidebarCtrl = this;
        angular.extend(sidebarCtrl, {
            $onInit: init,
            getWindowWidth: getWindowWidth,
            toggleSidebar: toggleSidebar,
            hasPermission: AuthService.hasPermission,
            stateIncludes: $state.includes,
            getActiveRoom: getActiveRoom,
            sidebarOpened: true,
            items: []
        });



        function init() {
            loadItems();
            openSidebarAtStartupIfNecessary(getWindowWidth());
        }

        function loadItems() {
            HomeDefinitionService.getHomeDefinition().then(function(homedef) {
                sidebarCtrl.items = homedef.rooms;
                if (homedef.programmables) {
                    sidebarCtrl.programmables = true;
                }
            });

        }

        function getActiveRoom() {
            return $stateParams.id;
        }

        function openSidebarAtStartupIfNecessary(width) {
            if (width >= mobileView && !sidebarCtrl.sidebarOpened) {
                toggleSidebar();
            }
            if (width <= mobileView && sidebarCtrl.sidebarOpened) {
                toggleSidebar();
            }
        }

        window.onresize = function() {
            $scope.$apply();
        };

        $scope.$watch(sidebarCtrl.getWindowWidth, function(newValue, oldValue) {
            openSidebarAtStartupIfNecessary(newValue);
        });

        function getWindowWidth() {
            return window.innerWidth;
        }

        function toggleSidebar() {
            sidebarCtrl.sidebarOpened = !sidebarCtrl.sidebarOpened;
            sidebarCtrl.onToggle({
                $event: {
                    sidebarOpened: sidebarCtrl.sidebarOpened
                }
            });
        }

    }

})();