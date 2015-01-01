'use strict';

angular.module('facedangularApp')
  .factory('FetchSvc', [ '$http', function($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      getUser: function(){
        return $http({
          method: 'GET',
          url: 'http://localhost:3000/user'
        });
      }
    };
  }]);
