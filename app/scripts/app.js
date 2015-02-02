(function() {
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
            'ngRoute',
            'underscore'
        ])
        .constant('apiUrl', {
            'url': 'http://freends-api.azurewebsites.net'
        })
        .config(function($routeProvider, $httpProvider) {
            
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            
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
})();
