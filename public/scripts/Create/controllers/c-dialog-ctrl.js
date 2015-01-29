define([
	'../../app'
], function (app) {
	//增加变量对话框的内部控制器
	app.controller('addParameterDialogCtrl',
		['$scope', 'dialogService',
		 function ($scope, dialogService) {

			 $scope.showInfoOnSubmit = false;
			 $scope.submitForm = function (){
				 dialogService.close("addParameterDialog", $scope.model);
			 }

			 $scope.cancelClick = function () {
				 dialogService.close("addParameterDialog");
			 }
		 }
		]);

	//测试用对话框控制器
	app.controller('deleteDialogCtrl', ['$scope', 'dialogService',
	   function ($scope, dialogService) {

		   $scope.confirmClick = function () {
			   dialogService.close("deleteDialog", $scope.model);
		   };

		   $scope.cancelClick = function () {
			   dialogService.cancel("deleteDialog");
		   };
	   }
	]);
});