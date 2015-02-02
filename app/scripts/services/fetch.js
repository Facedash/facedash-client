(function() {
  'use strict';
  angular.module('facedangularApp')
    .factory('FetchSvc', [ '$http', 'apiUrl', function($http, apiUrl) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      return {
        getUser: function(){
          return $http({
            method: 'GET',
            url: apiUrl.url + '/user'
          });
        }
      };
    }]);
})();
