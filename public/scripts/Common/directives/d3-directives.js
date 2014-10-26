(function() {
    angular.module('d3.directives', []).directive('barchart', ['BarChart', function(BarChart) {
        return {
            restrict: 'E',
            scope: {chartdata: '@'},

            link: function(scope, element) {
                var barchart = new BarChart(JSON.parse(scope.chartdata), element[0]);
                barchart.render();

                window.onresize = function() {
                    if (barchart) barchart.render();
                }
            }
        }
    }]).directive('linechart', ['LineChart', function(LineChart) {
        return {
            restrict: 'E',
            scope: {chartdata: '@'},

            link: function(scope, element) {
                var linechart = new LineChart(JSON.parse(scope.chartdata), element[0]);
                linechart.render();

                window.onresize = function() {
                    if (linechart) linechart.render();
                }
            }
        }
    }]).directive('piechart', ['PieChart', function(PieChart) {
        return {
            restrict: 'E',
            scope: {chartdata: '@'},

            link: function(scope, element) {
                var piechart = new PieChart(JSON.parse(scope.chartdata), element[0]);
                piechart.render();

                window.onresize = function() {
                    if (piechart) piechart.render();
                }
            }
        }
    }]).directive('map', ['Map', function(Map) {
        return {
            restrict: 'E',
            scope: {},
            link: function(scope, element) {
                var map;
                scope.$parent.getMapData().then(function(data) {
                    map = new Map(data, element[0]);
                    map.render();
                });

                window.onresize = function() {
                    if (map) map.render();
                }
            }
        }
    }]);

}).call(this);

