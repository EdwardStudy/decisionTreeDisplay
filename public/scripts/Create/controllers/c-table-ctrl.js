define([
	'../../app'
], function (app) {
	app.controller('tableCtrl', [
		'$scope',
		'$timeout',
		'dialogService',
		'tableService',
		'pubSubService',
		'treeConfig',
		'logger',
		function ($scope, $timeout, dialogService, tableService, pubSubService, treeConfig, logger) {
			$scope.table_array = [];

			pubSubService.subscribe(function () {
				$scope.table_array = tableService.get();
				console.log($scope.table_array);
			}, $scope, 'table_array_updated');

			//table列表
			$scope.selected_table_array = [];
			$scope.table_grid_option = {
				angridStyle:              "th-list",
				canSelectRows:            true,  //允许选择
				multiSelect:              false, //允许多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'table_array', //数据输入
				searchFilter:             '', //搜索过滤器
				selectedItems:            $scope.selected_table_array, //返回选中对象
				columnDefs:               [
					{
						field:       'table_id',
						displayName: 'Index',
						width:       '10%'
					},
					{
						field:       'name',
						displayName: 'Name',
		 				width:       '40%'
					},
					{
						field:       'description',
						displayName: 'Description',
						width:       '50%'
					}
				]
			};

			//表格选中项观测
			$scope.$watch("table_grid_option.selectedItems", function (newValue, oldValue) {
				$scope.selected_table_array = $scope.table_grid_option.selectedItems;
				$scope.table_detail_array = $scope.selected_table_array[0].value;
				console.log($scope.table_detail_array);
			});

			//删除table
			$scope.openDeleteTableDialog = function () {
				if ($scope.selected_table_array.length == 0) return;
				var model = $scope.selected_table_array;
				var options = {
					autoOpen:  false,
					width:     600,
					resizable: false,
					modal:     true,
					title:     "confirm"
				}

				dialogService.open("deleteDialog", "deleteDialog.html", model, options)
					.then(
					function (result) {
						$scope.selected_table_array = [];
						tableService.delete(result);
						logger.logSuccess("delete table"+ result.name +" success");
					},
					function (error) {
						logger.log("delete table cancel");
					}
				);
			}

			//编辑table
			$scope.openEditTableDialog = function () {
				if ($scope.selected_table_array.length == 0) return;
				var model = $scope.selected_table_array[0];
				// jQuery UI dialog options
				var options = {
					title:    "Edit table",
					autoOpen: false,
					modal:    true,
					height:   480,
					width:    500,
					close:    function (event, ui) {
						console.log("Predefined close");
					}
				};
				// Open the dialog
				dialogService.open("addTableDialog", "addTableDialog.html", model, options)
					.then(
					function (result) {
						if(result.column != model.column){
							angular.forEach(result.value, function(row,i){

							})
						}

						logger.logSuccess("update table"+ result.name +" success");
						tableService.update(result);
					},
					function (error) {
						logger.log("edit table cancel");
					}
				);
			}

			//添加table
			$scope.openAddTableDialog = function () {
				//这个地方要用copy函数，要不然$hashkey的值会重复
				var model = angular.copy(treeConfig.table_array[0]);
				model.table_id = treeConfig.getMaxId($scope.table_array, "table_id");
				console.log(model);
				// jQuery UI dialog options
				var options = {
					title:    "Add table",
					autoOpen: false,
					modal:    true,
					height:   480,
					width:    500,
					close:    function (event, ui) {
						console.log("Predefined close");
					}
				};
				// Open the dialog
				dialogService.open("addTableDialog", "addTableDialog.html", model, options)
					.then(
					function (result) {
						logger.logSuccess("add new table"+ result.name +" success");
						tableService.post(result);
					},
					function (error) {
						logger.log("add table cancel");
					}
				);
			};

			$scope.table_detail_array = $scope.selected_table_array[0].value;
			$scope.table_grid_option = {
				angridStyle:              "th-list",
				canSelectRows:            true,  //允许选择
				multiSelect:              false, //允许多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'table_detail_array', //数据输入
				searchFilter:             '', //搜索过滤器
				columnDefs:               [
					{
						field:       'table_id',
						displayName: 'Index',
						width:       '10%'
					},
					{
						field:       'name',
						displayName: 'Name',
						width:       '40%'
					},
					{
						field:       'description',
						displayName: 'Description',
						width:       '50%'
					}
				]
			};

		}
	])
	;

	app.controller('addTableDialogCtrl', [
		'$scope', '$timeout', 'dialogService',
		function ($scope, $timeout, dialogService) {
			$scope.default_column = $scope.model.column;

			$scope.saveClick = function () {
				dialogService.close("addTableDialog", $scope.model);
			};

			$scope.cancelClick = function () {
				dialogService.cancel("addTableDialog");
			};
		}
	]);

})
;