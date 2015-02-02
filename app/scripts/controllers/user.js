(function() {
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

                    //build a bar chart array
                    var buildChartInfo = function(info) {
                        var array = [];
                        if(typeof info === 'number') return [['same', info]];
                        _.each(info, function(item, property){
                            array.push([property, item.count]);
                        });
                        return array;
                    };

                    var generateGraph = function(htmlId, typeOfGraph, dataArray) {
                        c3.generate({
                            bindto: htmlId,
                            data: {
                                columns: dataArray,
                                type: typeOfGraph
                            },
                            color: {
                                pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
                            }
                        });
                    };

                    // location
                    var location = buildChartInfo($scope.information.friends.location.percentage);
                    generateGraph('#location', 'gauge', location);

                    // Hometown
                    var hometown = buildChartInfo($scope.information.friends.hometown.percentage);
                    generateGraph('#hometown', 'gauge', hometown);

                    // Relationship
                    var relationship = buildChartInfo($scope.information.friends.relationshipStatus.type);
                    generateGraph('#relationship', 'bar', relationship);

                    // Gender
                    var gender = buildChartInfo($scope.information.friends.gender.type);
                    generateGraph('#gender', 'pie', gender);
                });
    }]);
})();