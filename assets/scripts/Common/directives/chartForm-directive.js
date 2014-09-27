define([
        '../../app',
        'd3'
    ],
    function (app, d3) {
        'use strict';

        app.directive('chartForm', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '../../../views/v_Common/chartForm.html',
                controller: function AppCtrl($scope) {
                    $scope.update = function (d, i) {
                        $scope.data = randomData();
                    };
                    function randomData() {
                        return d3.range(~~(Math.random() * 50) + 1).map(function (d, i) {
                            return ~~(Math.random() * 1000);
                        });
                    }
                }
            };
        });

    });