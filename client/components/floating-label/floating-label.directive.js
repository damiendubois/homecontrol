(function() {
    'use strict';

    angular.module('cwt.gui')

    .directive('floatingLabel', function() {
        return {
            restrict: 'A',
            link: function($scope, $element, attrs) {
                //hide label tag assotiated with given input

                $scope.$watch(function() {
                    if ($element.val().toString().length < 1) {
                        $element.addClass('empty');
                    } else {
                        $element.removeClass('empty');
                    }
                });
            }
        };
    });

})();
