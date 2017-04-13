(function () {
  'use strict';

  angular
    .module('app.layout')
    .component('cwtBreadcrumb', {
      templateUrl: 'app/layout/components/breadcrumb/breadcrumb.component.html',
      binding: {},
      controller: BreadcrumbCtrl,
      controllerAs: 'breadcrumbCtrl'
    });



  BreadcrumbCtrl.$inject = [
    '$state',
    '$rootScope'
  ];

  function BreadcrumbCtrl($state,$rootScope) {

    var breadcrumbCtrl = this;
    angular.extend(breadcrumbCtrl, {
      $onInit:onInit,
      $onDestroy:onDestroy,
      breadCrumbPath: []
    });
    
    var breadCrumbWatchDeregistration =$rootScope.$on('$stateChangeSuccess', reloadBreadcrumb);

    function onInit(){
      reloadBreadcrumb();
    }
    function onDestroy(){
      breadCrumbWatchDeregistration();
    }

    /**
     * Reload the breadcrumb path item
     * @return {void}
     */
    function reloadBreadcrumb(){
      breadcrumbCtrl.breadCrumbPath=[];
      generateBreadcrumbs($state.$current);
    }

    /**
     * Recursive function that compute all parent states
     * @param  {object} state [router state object]
     * @return {void}
     */
    function generateBreadcrumbs(state) {
      if(angular.isDefined(state.parent)) {
        generateBreadcrumbs(state.parent);
      }
      if(angular.isDefined(state.breadcrumb)) {
          breadcrumbCtrl.breadCrumbPath.push(state);
      }
    }

  }
})();
