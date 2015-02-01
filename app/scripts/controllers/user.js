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

                console.log('Relationship status: ', $scope.information.friends.relationshipStatus);
                console.log('gender: ', $scope.information.friends.gender);

                
                //build a bar chart array
                var columns = [];
                _.each($scope.information.friends.relationshipStatus.type, function(item, property){
                    // console.log('property: ', property);
                    // console.log('item: ', item);
                    columns.push([property, item.count]);
                });

                console.log(columns);

                var chart = c3.generate({
                    bindto: '#chart',
                    data: {
                        columns: [['data1', 30, 200, 100, 400, 150, 250],['data2', 50, 20, 10, 40, 15, 25]]
                    }
                });

                var chart = c3.generate({
                    bindto: '#location',
                    data: {
                        // iris data from R
                        columns: [
                            ['Same Location', $scope.information.friends.location.count],
                            ['Different', $scope.user.friendsCount]
                        ],
                        type : 'pie',
                        colors: {
                            'Same Location': d3.rgb('#2a2a2b'),
                            'Different': d3.rgb('#2a2a2b').darker(2)
                        }
                    }
                });

                var chart = c3.generate({
                    bindto: '#hometown',
                    data: {
                        // iris data from R
                        columns: [
                            ['Same hometown', $scope.information.friends.hometown.count],
                            ['Different', $scope.user.friendsCount]
                        ],
                        type : 'pie',
                        colors: {
                            'Same hometown': d3.rgb('#2a2a2b'),
                            'Different': d3.rgb('#2a2a2b').darker(2)
                        }
                    }
                });

                var chart = c3.generate({
                    bindto: '#relationship',
                    data: {
                        columns: columns,
                        type: 'bar'
                    },
                    bar: {
                        width: {
                            ratio: 0.5 // this makes bar width 50% of length between ticks
                            // or
                            //width: 100 // this makes bar width 100px
                        }
                    }
                });

                var chart = c3.generate({
                    bindto: '#gender',
                    data: {
                        columns: [
                            ['female', $scope.information.friends.gender.type.female.count],
                            ['male', $scope.information.friends.gender.type.male.count]
                        ],
                        type: 'pie',
                        colors: {
                            'female': d3.rgb('#2a2a2b'),
                            'male': d3.rgb('#2a2a2b').darker(2)
                        }
                    },
                    bar: {
                        width: {
                            ratio: 0.5 // this makes bar width 50% of length between ticks
                            // or
                            //width: 100 // this makes bar width 100px
                        }
                    }
                });
            });
}]);
