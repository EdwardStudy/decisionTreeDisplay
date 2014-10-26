define([
	'../../app',
	'd3',
	'Create/components/c-DTree'
], function (app, d3, dtreeChart) {
	'use strict';
	app.directive('dtree', ['safeApply', function (safeApply) {
		var chart = dtreeChart();
		return {
			restrict: 'AE',
			replace: true,
			template: '<div class="dtree-topic"></div>',
			scope:{
				data: '=data',
				option: '=option'
			},
			link: function(scope, element, attrs) {
				console.log(scope.data);

				var chartEl = d3.select(element[0]);

				scope.$watch('data', function (newVal, oldVal) {
					var param = {
						_data: newVal,
						_option: scope.option
					}
					chartEl.datum(param).call(chart);
				});

				chartEl.on('nodeClick', function (d, i) {
					scope.$emit("dtreeNodeClick", d);
				});

				chartEl.on('evaluationDialog', function (d, i) {
					scope.$emit("evaluationDialog", d);
				});

				chartEl.on('infoboxDblclick', function (d, i) {
					scope.$emit("infoboxDblclick", d);
				});



			}
		};
	}]);
});