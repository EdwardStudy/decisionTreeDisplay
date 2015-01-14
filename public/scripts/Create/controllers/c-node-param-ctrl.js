define([
	'../../app'
], function (app) {
	app.controller('createDTreeCtrl', [
		'$scope',
		'$http',
		'$timeout',
		'dialogService',
		'createDtreeService',
		'nodeParamService',
		'$stateParams',
		function ($scope, $http, $timeout, dialogService, createDtreeService, nodeParamService, $stateParams) {
		}
	]);

});