define([
	'../../app'
], function (app) {

	app.controller('SelectDtreeCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
		$scope.newProject = function(){

			$state.go('creates', {
				project_id: "Dtree-structure3",
				project_name: "空白的决策树"
			});
		}

	}]);

});
