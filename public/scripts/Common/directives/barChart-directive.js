define([
    '../../app',
    'd3',
    'Common/components/barChart'
], function (app, d3, barChart) {
    'use strict';
    app.directive('barChart', [function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="chart"></div>',
            scope: {
                width: '=width',
                height: '=height',
                data: '=data',
                hovered: '&hovered'
            },
            link: function (scope, element, attrs) {
                var chart = barChart();

                var chartEl = d3.select(element[0]);
                chart.on('customHover', function (d, i) {
                    scope.hovered({args: d});
                });

                scope.$watch('data', function (newVal, oldVal) {
                    chartEl.datum(newVal).call(chart);
                });

                scope.$watch('width', function (d, i) {
                    chartEl.call(chart.width(scope.width));
                });
                scope.$watch('height', function (d, i) {
                    chartEl.call(chart.height(scope.height));
                });
            }
        };
    }]);
});