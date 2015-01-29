define([
	'../../app'
], function (app) {
	app.controller('distrCtrl', [
		'$scope',
		'$timeout',
		'dialogService',
		'distrService',
		'pubSubService',
		'treeConfig',
		'logger',
		function ($scope, $timeout, dialogService, distrService, pubSubService, treeConfig, logger) {
			$scope.distr_array = [];

			pubSubService.subscribe(function () {
				$scope.distr_array = distrService.get();
				console.log($scope.distr_array);
			}, $scope, 'distr_array_updated');

			//分布表格
			$scope.distr_grid_option = {
				angridStyle:              "th-list",
				canSelectRows:            true,  //允许选择
				multiSelect:              false, //允许多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'distr_array', //数据输入
				searchFilter:             '', //搜索过滤器
				selectedItems:            $scope.selected_distr_array, //返回选中对象
				columnDefs:               [
					{
						field:       'distr_id',
						displayName: 'Index',
						width:       '5%'
					},
					{
						field:       'name',
						displayName: 'Name',
						width:       '20%'
					},
					{
						field:       'type',
						displayName: 'Type',
						width:       '20%'
					},
					{
						field:       'value',
						displayName: 'Param',
						width:       '15%'
					},
					{
						field:       'description',
						displayName: 'Description',
						width:       '30%'
					},
					{ field:         'category',
						displayName: 'Category',
						width:       '10%'
					}
				]
			};

			//表格选中项观测
			$scope.selected_distr_array = [];
			$scope.$watch("distr_grid_option.selectedItems", function (newValue, oldValue) {
				$scope.selected_distr_array = $scope.distr_grid_option.selectedItems;
			});


			//删除分布
			$scope.openDeleteDistrDialog = function () {
				if ($scope.selected_distr_array.length == 0) return;
				var model = $scope.selected_distr_array;
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
						$scope.selected_distr_array = [];
						distrService.delete(result);
						logger.logSuccess("delete distrubtion"+ result.name +" success");
					},
					function (error) {
						logger.log("delete distribution cancel");
					}
				);
			}

			//编辑分布
			$scope.openEditDistrDialog = function () {
				if ($scope.selected_distr_array.length == 0) return;
				var model = $scope.selected_distr_array[0];
				// jQuery UI dialog options
				var options = {
					title:    "Edit distribution",
					autoOpen: false,
					modal:    true,
					height:   700,
					width:    700,
					close:    function (event, ui) {
						console.log("Predefined close");
					}
				};
				// Open the dialog
				dialogService.open("addDistrDialog", "addDistrDialog.html", model, options)
					.then(
					function (result) {
						logger.logSuccess("update distrubtion"+ result.name +" success");
						distrService.update(result);
					},
					function (error) {
						logger.log("edit distribution cancel");
					}
				);
			}

			//添加分布
			$scope.openAddDistrDialog = function () {
				//这个地方要用copy函数，要不然$hashkey的值会重复
				var model = angular.copy(treeConfig.distribution_array[0]);
				model.distr_id = treeConfig.getMaxId($scope.distr_array, "distr_id");
				// jQuery UI dialog options
				var options = {
					title:    "Add distribution",
					autoOpen: false,
					modal:    true,
					height:   700,
					width:    700,
					close:    function (event, ui) {
						console.log("Predefined close");
					}
				};
				// Open the dialog
				dialogService.open("addDistrDialog", "addDistrDialog.html", model, options)
					.then(
					function (result) {
						logger.logSuccess("add new distrubtion"+ result.name +" success");
						distrService.post(result);
					},
					function (error) {
						logger.log("add distribution cancel");
					}
				);
			};
		}
	])
	;

	app.controller('addDistrDialogCtrl', [
		'$scope', '$timeout', 'dialogService','treeConfig', 'distrConfig',
		function ($scope, $timeout, dialogService, treeConfig, distrConfig) {
			$scope.distr_list = distrConfig;
			//分布单选框，还是用ng-grid做的
			$scope.select_distr = null;
			$scope.distr_select_option = {
				angridStyle:              "th-list",
				canSelectRows:            true,  //允许选择
				multiSelect:              false, //不允许多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'distr_list', //数据输入
				searchFilter:             '', //搜索过滤器
				selectedItems:            [], //返回选中对象
				columnDefs:               [
					{
						field:          'name',
						displayName:    'Distrbution Type',
						width:          '100%',
						columnTemplete: '<div class="distr-gird"><i class="distr-icon {{rowData[colData.field]}} "></i>{{rowData[colData.field]}}</div>'
					}
				]
			};

			//按照当前选中的分布设置model参数
			$scope.setDistrModel = function(){
				$scope.model.type = $scope.select_distr.name;
				$scope.model.value = [];
				angular.forEach($scope.select_distr.parameter, function (p) {
					$scope.model.value.push(p["default"]);
				})
			}

			//表格选中项观测
			$scope.$watch("distr_select_option.selectedItems", function (newValue, oldValue) {
				if($scope.distr_select_option.selectedItems.length != 0){
					$scope.select_distr = $scope.distr_select_option.selectedItems[0];
					if ($scope.model.type != $scope.select_distr.name) {
						$scope.setDistrModel();
					}
				}
			});

			//angrid的selectRowFuc函数需要用$apply或者$timeout重新引导
			$timeout(function () {
				if($scope.model.name == ""){
					//如果name为空意味这是add new distribution, 默认选中Normal（正态分布）
					$scope.select_distr = $scope.distr_list[0];
					$scope.setDistrModel();
					$scope.distr_select_option.selectRowFuc(0, true);

				}else{
					//如果name不为空意味着这是edit distribution，需要选中model.tpye所标志的分布
					angular.forEach($scope.distr_list, function(d, i){
						if(d.name == $scope.model.type){
							$scope.select_distr = $scope.distr_list[i];
							$scope.distr_select_option.selectRowFuc(i, true);
						}
					});
				}
			}, 1);

			//是否显示可选参数（仅beta，logNormal分布有这种选项）
			$scope.showOptional = false;
			$scope.showOptionalParam = function (p, trigger) {
				if (!angular.isDefined(p.optional)) {
					return true;
				}
				return trigger;
			}

			$scope.saveClick = function () {
				dialogService.close("addDistrDialog", $scope.model);
			};

			$scope.cancelClick = function () {
				dialogService.cancel("addDistrDialog");
			};
		}
	]);

})
;