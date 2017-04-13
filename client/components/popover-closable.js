'use strict';

angular.module('app')

.config(function($uibTooltipProvider) {
  $uibTooltipProvider.setTriggers({'open': 'close'});
})

.directive('popoverToggle', function($timeout) {
  return {
    scope: true,
    link: function(scope, element, attrs) {
      scope.toggle = function() {
        $timeout(function() {
          element.triggerHandler(scope.openned ? 'close' : 'open');
          scope.openned = !scope.openned;
        });
      };
      return element.on('click', scope.toggle);
    }
  };
});