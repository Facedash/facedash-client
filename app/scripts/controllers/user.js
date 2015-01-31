'use strict';

angular.module('facedangularApp')
    .controller('UserCtrl', [
        '$scope',
        'FetchSvc',
        '_',
        'UtilsSvc',
        function($scope, FetchSvc, _, UtilsSvc) {
            
            FetchSvc.getUser().success(function(data) {
                $scope.info = data.atTheEnd.me;
                $scope.friends = data.atTheEnd.friends;
                $scope.friends.plucked = _.pluck(data.atTheEnd.friends, 'hometown');

                $scope.user = {
                    friendsCount: data.atTheEnd.friends.length,
                    hometown: _.values(data.atTheEnd.me.hometown)[1],
                    location: _.values(data.atTheEnd.me.location)[1],
                    timezone: data.atTheEnd.me.timezone,
                    locale: data.atTheEnd.me.locale,
                    firstName: data.atTheEnd.me.firstName,
                    lastName: data.atTheEnd.me.lastName
                };

                $scope.information = {
                    friends: {
                        location: UtilsSvc.compareInfo(data.atTheEnd.friends, 'location', $scope.user),
                        hometown: UtilsSvc.compareInfo(data.atTheEnd.friends, 'hometown', $scope.user),
                        averageAge: UtilsSvc.AverageAge(data.atTheEnd.friends, $scope.user),
                        relationshipStatus: UtilsSvc.breakDownInfo(data.atTheEnd.friends, 'relationship_status', $scope.user),
                        gender: UtilsSvc.breakDownInfo(data.atTheEnd.friends, 'gender', $scope.user)
                    }
                };

                console.log('Relationship status: ', $scope.information.friends.relationshipStatus.type);
            });
}]);
