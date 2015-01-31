'use strict';

angular.module('facedangularApp')
    .controller('UserCtrl', ['$scope', 'FetchSvc', '_', function($scope, FetchSvc, _) {
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
                    location: $scope.compareInfo(data.atTheEnd.friends, 'location', $scope.user),
                    hometown: $scope.compareInfo(data.atTheEnd.friends, 'hometown', $scope.user),
                    averageAge: $scope.AverageAge(data.atTheEnd.friends, $scope.user),
                    relationshipStatus: $scope.breakDownInfo(data.atTheEnd.friends, 'relationship_status', $scope.user),
                    gender: $scope.breakDownInfo(data.atTheEnd.friends, 'gender', $scope.user)
                }
            };

            console.log('Relationship status: ', $scope.information.friends.relationshipStatus.type);

            $scope.locationConfig = {
                chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                borderWidth: 0
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                                pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
            },
                series: [{
                    type: 'pie',
                    name: 'Location',
                    data: [
                        ['Same', $scope.information.friends.location.percentage],
                        ['Different', 100 - $scope.information.friends.location.percentage]]
                }],
                loading: false
            };

            $scope.hometownConfig = {
                title: {
                    text: ''
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: [
                        ['Same', $scope.information.friends.hometown.percentage],
                        ['Different', 100 - $scope.information.friends.hometown.percentage]]
                }],
                loading: false
            };

            $scope.genderConfig = {
                title: {
                    text: ''
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: [
                        ['male', $scope.information.friends.gender.type.male.percentage],
                        ['female', $scope.information.friends.gender.type.female.percentage]]
                }],
                loading: false
            };

            $scope.relationshipStatusConfig = {
                // chart: {
                //     type: 'column'
                // },
                title: {
                    text: ''
                },
                // subtitle: {
                //     text: 'Source: WorldClimate.com'
                // },
                // xAxis: {
                //     categories: _.keys($scope.information.friends.relationshipStatus.type)
                // },
                // yAxis: {
                //     min: 0,
                //     title: {
                //         text: 'Status (person)'
                //     }
                // },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: $scope.buildSeries($scope.information.friends.relationshipStatus.type)
            }
        });

        $scope.buildSeries = function(Obj){
            var array = [];
            _.each(Obj, function(value, key){
                array.push({
                    type: 'column',
                    name: key,
                    data: [value.count]
                });
            });
            return array;
        };

        $scope.BuildInfoArray = function(FBdata, field) {
                var result = [];
                var type = null;
                _.each(FBdata, function(obj) {
                    if (obj[field]) {
                        type = obj[field];
                        return;
                    }
                });

                if (typeof(type) === 'string') {
                    result = _.chain(FBdata).pluck(field).compact().value();
                } else if (Array.isArray(type)) {
                    _.each(FBdata, function(obj) {
                        _.each(obj[field], function(item) {
                            result.push(item.name);
                        });
                    });
                } else {
                    result = _.chain(FBdata).map(function(obj) {
                        if (obj[field]) {
                            return obj[field].name;
                        }
                    }).compact().value();
                }

                return result;
            },

            $scope.compareInfo = function(FBdata, field, user) {
                var infoArray = this.BuildInfoArray(FBdata, field);
                var obj = {};

                obj.totalCount = _.size(infoArray);
                obj.count = _.filter(infoArray, function(item) {
                    return item === user[field];
                }).length;
                obj.precision = (_.size(infoArray) / user.friendsCount) * 100;
                obj.percentage = (obj.count / obj.totalCount) * 100;

                // obj {totalCount: array.length, sameCount: XXX}
                return obj;
            },

            $scope.breakDownInfo = function(FBdata, field, user) {
                var infoArray = this.BuildInfoArray(FBdata, field);
                var totCount = 0;

                var obj = {
                    type: {}
                };

                _.each(infoArray, function(item) {
                    if (obj.type[item]) {
                        obj.type[item]['count'] ++;
                    } else {
                        obj.type[item] = {};
                        obj.type[item]['count'] = 1;
                    }

                    totCount++;
                });

                // Percentage per relationship status
                _.each(obj.type, function(item) {
                    item['percentage'] = (item['count'] / totCount) * 100;
                });

                obj.totCount = totCount;
                obj.precision = (totCount / user.friendsCount) * 100;
                // console.log(obj);
                return obj;
            },

            $scope.AverageAge = function(FBdata, user) {
                var infoArray = this.BuildInfoArray(FBdata, 'birthday');

                var obj = {};
                var year = new Date().getFullYear();

                obj.count = _.chain(infoArray)
                    .reject(function(item) {
                        return item.length <= 5;
                    })
                    .map(function(item) {
                        return parseInt(item.substr(-4));
                    })
                    .value()
                    .length;

                obj.avgYear = Math.round((_.chain(infoArray)
                    .reject(function(item) {
                        return item.length <= 5;
                    })
                    .map(function(item) {
                        return parseInt(item.substr(-4));
                    })
                    .reduce(function(memo, num) {
                        return memo + num;
                    }, 0)
                    .value()) / obj.count);

                obj.avgAge = year - obj.avgYear;
                obj.precision = Math.floor((obj.count / user.friendsCount) * 100);
                // console.log(obj);
                return obj;
            };

            Highcharts.theme = {
              colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
              chart: {
                backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                  stops: [[0, '#2a2a2b'],[1, '#3e3e40']]
                },
                style: {
                  fontFamily: "'Unica One', sans-serif"
                },
                plotBorderColor: '#606063'
              },
              title: {
                style: {
                  color: '#E0E0E3',
                  textTransform: 'uppercase',
                  fontSize: '20px'
                }
              },
              subtitle: {
                style: {
                  color: '#E0E0E3',
                  textTransform: 'uppercase'
                }
              },
              xAxis: {
                gridLineColor: '#707073',
                labels: {
                  style: {
                    color: '#E0E0E3'
                  }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                  style: {
                    color: '#A0A0A3'
                  }
                }
              },
              yAxis: {
                gridLineColor: '#707073',
                labels: {
                  style: {
                    color: '#E0E0E3'
                  }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                  style: {
                    color: '#A0A0A3'
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                  color: '#F0F0F0'
                }
              },
              plotOptions: {
                series: {
                  dataLabels: {
                    color: '#B0B0B3'
                  },
                  marker: {
                    lineColor: '#333'
                  }
                },
                boxplot: {
                  fillColor: '#505053'
                },
                candlestick: {
                  lineColor: 'white'
                },
                errorbar: {
                  color: 'white'
                }
              },
              legend: {
                itemStyle: {
                  color: '#E0E0E3'
                },
                itemHoverStyle: {
                  color: '#FFF'
                },
                itemHiddenStyle: {
                  color: '#606063'
                }
              },
              credits: {
                style: {
                  color: '#666'
                }
              },
              labels: {
                style: {
                  color: '#707073'
                }
              },
              drilldown: {
                activeAxisLabelStyle: {
                  color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                  color: '#F0F0F3'
                }
              },
              navigation: {
                buttonOptions: {
                  symbolStroke: '#DDDDDD',
                  theme: {
                    fill: '#505053'
                  }
                }
              },

              // scroll charts
              rangeSelector: {
                buttonTheme: {
                  fill: '#505053',
                  stroke: '#000000',
                  style: {
                    color: '#CCC'
                  },
                  states: {
                    hover: {
                      fill: '#707073',
                      stroke: '#000000',
                      style: {
                        color: 'white'
                      }
                    },
                    select: {
                      fill: '#000003',
                      stroke: '#000000',
                      style: {
                        color: 'white'
                      }
                    }
                  }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                  backgroundColor: '#333',
                  color: 'silver'
                },
                labelStyle: {
                  color: 'silver'
                }
              },

              navigator: {
                handles: {
                  backgroundColor: '#666',
                  borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                  color: '#7798BF',
                  lineColor: '#A6C7ED'
                },
                xAxis: {
                  gridLineColor: '#505053'
                }
              },
              scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
              },

              // special colors for some of the
              legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
              background2: '#505053',
              dataLabelsColor: '#B0B0B3',
              textColor: '#C0C0C0',
              contrastTextColor: '#F0F0F3',
              maskColor: 'rgba(255,255,255,0.3)'
            };
            // Apply the theme
            Highcharts.setOptions(Highcharts.theme);
          }]);
