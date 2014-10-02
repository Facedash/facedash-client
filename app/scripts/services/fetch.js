'use strict';

angular.module('facedangularApp')
  .service('Fetch', function Fetch($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      getUser: function(){
        return $http({
          method: 'GET',
          url: 'http://facedash-api.azurewebsites.net/user'
        })
      }
    }
  });
