define([
	'../../app'
], function (app) {
	//增加变量对话框的内部控制器
	app.controller('addParameterDialogCtrl',
		['$scope', 'dialogService',
		 function ($scope, dialogService) {
			 $scope.showInfoOnSubmit = false;
			 $scope.submitForm = function () {
				 dialogService.close("addParameterDialog", $scope.model);
			 }

			 $scope.cancelClick = function () {
				 dialogService.close("addParameterDialog");
			 }
		 }
		]);

	//测试用对话框控制器
	app.controller('dialogCtrl',
		['$scope', 'dialogService',
		 function ($scope, dialogService) {
			 // $scope.model contains the object passed to open in config.model

			 $scope.saveClick = function () {
				 dialogService.close("myDialog", $scope.model);
			 };

			 $scope.cancelClick = function () {
				 dialogService.cancel("myDialog");
			 };
		 }
		]);
});