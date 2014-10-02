'use strict';

/**
 * @ngdoc overview
 * @name newYoApp
 * @description
 * # newYoApp
 *
 * Main module of the application.
 */
angular
  .module('facedangularApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/user', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
