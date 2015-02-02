(function() {
    'use strict';
    angular.module('facedangularApp')
        .factory('UtilsSvc', ['_', function(_) {
            var Utils = {};

            Utils.buildSeries = function(Obj) {
                var array = [];
                _.each(Obj, function(value, key) {
                    array.push({
                        type: 'column',
                        name: key,
                        data: [value.count]
                    });
                });
                return array;
            };

            Utils.BuildInfoArray = function(FBdata, field) {
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

            Utils.compareInfo = function(FBdata, field, user) {
                var infoArray = this.BuildInfoArray(FBdata, field);
                var obj = {};

                obj.totalCount = _.size(infoArray);
                obj.count = _.filter(infoArray, function(item) {
                    return item === user[field];
                }).length;
                obj.precision = (_.size(infoArray) / user.friendsCount) * 100;
                obj.percentage = (obj.count / obj.totalCount) * 100;

                return obj;
            },

            Utils.breakDownInfo = function(FBdata, field, user) {
                var infoArray = this.BuildInfoArray(FBdata, field);
                var totCount = 0;

                var obj = {
                    type: {}
                };

                _.each(infoArray, function(item) {
                    if (obj.type[item]) {
                        obj.type[item].count ++;
                    } else {
                        obj.type[item] = {};
                        obj.type[item].count = 1;
                    }

                    totCount++;
                });

                // Percentage per relationship status
                _.each(obj.type, function(item) {
                    item.percentage = (item.count / totCount) * 100;
                });

                obj.totCount = totCount;
                obj.precision = (totCount / user.friendsCount) * 100;
                return obj;
            },

            Utils.AverageAge = function(FBdata, user) {
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
                return obj;
            };

            return Utils;

        }]);
})();
