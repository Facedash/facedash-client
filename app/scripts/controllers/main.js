(function() {
	'use strict';
	angular.module('facedangularApp')
	  .controller('MainCtrl', [ '$scope', 'apiUrl', function ($scope, apiUrl) {
	  	$scope.apiUrl = apiUrl.url + '/auth/facebook';
	  }]);
})();
