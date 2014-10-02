'use strict';

angular.module('facedangularApp')
  .directive('navigation', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/navigation.html',
    };
  });
