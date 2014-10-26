define([
	'../../app',
	'd3',
	'Create/components/c-DTree'
//    'Create/components/pedigreeTree'
], function (app, d3, dtreeChart) {
	'use strict';
	app.directive('dtree', ['safeApply', function (safeApply) {
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

				// send information to d3 component
				var chart = dtreeChart(element[0]);

				scope.$watch('data', function (newVal, oldVal) {
					chart.setData(newVal, scope.option);
				});

				chart.on('nodeClick', function (d, i) {
					scope.$emit("dtreeNodeClick", d);
				});

				chart.on('evaluationDialog', function (d, i) {
					scope.$emit("evaluationDialog", d);
				});

				chart.on('infoboxDblclick', function (d, i) {
					scope.$emit("infoboxDblclick", d);
				});



			}
		};
	}]);
});