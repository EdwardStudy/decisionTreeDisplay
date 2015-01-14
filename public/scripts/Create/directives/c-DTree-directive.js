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
				// watch data, redraw all the canvas if data has changed
				scope.$watch('data', function (newVal, oldVal) {
					chart.setData(newVal, scope.option);
				});

				//the listener for events from parent's controller
				//parent controller --> dtree directive --> dtree component
				scope.$on("updateDTree", function (event, msg) {
					chart.updateDTree();
				});
				scope.$on("resetDTree", function (event, msg) {
					chart.resetDTree();
				});

				//the listener for events from dtree component
				//dtree component --> dtree directive --> parent controller
				//节点选中事件
				chart.on('dtreeNodeClick', function (d) {
					scope.$emit("dtreeNodeClick", d);
				});
				//节点删除事件
				chart.on('dtreeNodeDelete', function (d) {
					scope.$emit("dtreeNodeDelete", d);
				});
				//节点清除选中状态事件
				chart.on('dtreeNodeRemoveActiveStyle', function (d) {
					scope.$emit("dtreeNodeRemoveActiveStyle", d);
				});
				//infobox单击事件
				chart.on('infoboxPClick', function (d) {
					scope.$emit("infoboxPClick", d);
				});
				//infobox双击事件
				chart.on('infoboxPDblclick', function (d) {
					scope.$emit("infoboxPDblclick", d);
				});
				//激活节点计算对话框
				chart.on('evaluationDialog', function (d) {
					scope.$emit("evaluationDialog", d);
				});
				//激活payoff编辑对话框
				chart.on('dtreePayoffEdit', function (d) {
					scope.$emit("dtreePayoffEdit", d);
				});
			}
		};
	}]);
});