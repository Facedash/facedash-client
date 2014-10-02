'use strict';

angular.module('facedangularApp')
  .controller('UserCtrl', function ($scope, Fetch) {
    Fetch.getUser().success(function(data){
      $scope.info = data;
    });
  });
