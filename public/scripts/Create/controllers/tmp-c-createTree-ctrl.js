define([
	'../../app'
], function (app) {
	app.controller('createDTreeCtrl', [
		'$scope',
		'$http',
		'$timeout',
		'dialogService',
		'createDtreeService',
		'$stateParams',
		'$state',
		function ($scope, $http, $timeout, dialogService, createDtreeService, $stateParams, $state) {
			//获取Dtree ID
			$scope.DtreeId = $stateParams.project_id;
			console.log("$stateParams.project_id", $scope.DtreeId);
			//默认样式
			$scope.canvasUiStyle = "white-print";
			//决策树数据
			$scope.treeStructure = undefined;
			$scope.treeConfig = undefined;
			$scope.treeParameter = undefined;

			//节点的信息显示
			$scope.selectedNodeData = undefined; //当前选中的节点
			$scope.NodeGridData = [];           //当前选中的节点的所有变量数据
			$scope.selectedNodeParamData = []; //当前选中的节点的选中的变量数据
			$scope.NodeGridOption = {
				angridStyle:              "th-list",
				canSelectRows:            true,  //允许选择
				multiSelect:              true, //允许多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'NodeGridData', //数据输入
				searchFilter:             '', //搜索过滤器
				selectedItems:            $scope.selectedNodeParamData, //返回选中对象
				columnDefs:               [
					{
						field:          'display',
						displayName:    'show',
						width:          '10%',
						columnClick:    function (row) {
							row.display = !row.display;
							//同步tree Properties表格数据
							angular.forEach($scope.treeParameter, function (param, key) {
								if (row.pid == param.pid)
									param.display = !param.display;
							})
							//同步dtree数据
							$scope.$broadcast("updateDTree", row);
						},
						columnTemplete: '<input type="checkbox" ng-model="rowData[colData.field]" ng-click="colData.columnClick(rowData)"/>'
					},
					{
						field:       'name',
						displayName: 'Name',
						width:       '20%'
					},
					{
						field:          'formula',
						displayName:    'Definition',
						width:          '30%',
						columnChange:   function (row){
							//同步tree Properties表格数据
							angular.forEach($scope.treeParameter, function (param, key) {
								if (row.pid == param.pid)
									param.formula = row.formula;
							})
							//同步dtree数据
							$scope.$broadcast("updateDTree", row);
						},
						columnTemplete: '<input type="text" ng-model="rowData[colData.field]"  style="width:100%;" ng-change="colData.columnChange(rowData)" />'
					},
					{
						field:       'description',
						displayName: 'Description',
						width:       '20%'
					},
					{ field:         'category',
						displayName: 'Category',
						width:       '20%'
					}
				]
			};

			//we must watch attribute in a $scope.object, then the bothway binding will be establish
			$scope.$watch("NodeGridOption.selectedItems", function (newValue, oldValue) {
				$scope.selectedNodeParamData = $scope.NodeGridOption.selectedItems;
			});

			//决策树general表格的数据和配置信息
			$scope.generalGridData = [];
			$scope.generalGridOption = {
				angridStyle:              "th-list",
				canSelectRows:            false, //多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'generalGridData', //数据输入
				columnDefs:               [
					{
						field:       'property',
						displayName: 'Property',
						width:       '20%'
					},
					{
						field:          'value',
						displayName:    'Value',
						width:          '80%',
						columnBlur:     function (row) { //自定义赋值函数
							$scope.treeConfig[row.property] = row.value;
						},
						columnTemplete: '<input type="text" ng-model="rowData[colData.field]" style="width:100%;" ng-blur="colData.columnBlur(rowData)" />'
					}
				]
			}

			//决策树all variables表格的数据和配置信息
			$scope.variablesGridOption = {
				angridStyle:              "th-list",
				canSelectRows:            true,  //允许选择
				multiSelect:              true,  //允许多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'treeParameter', //数据输入
				searchFilter:             '', //搜索过滤器
				selectedItems:            $scope.selectedNodeParamData, //返回选中对象
				columnDefs:               [
					{
						field:          'display',
						displayName:    'show',
						width:          '10%',
						columnClick:    function (row) {
							row.display = !row.display;
							//同步tree structure 数据
							var operation = function (d) {
								angular.forEach(d.variable, function (param, key) {
									if (row.pid == param.pid) {
										param.display = !param.display;
										//同步dtree数据
										$scope.$broadcast("updateDTree", row);
										return;
									}
								})
							};
							rootFirstTraversalStructure(operation);
						},
						columnTemplete: '<input type="checkbox" ng-model="rowData[colData.field]" ng-click="colData.columnClick(rowData)"/>'
					},
					{
						field:       'name',
						displayName: 'Name',
						width:       '20%'
					},
					{
						field:          'formula',
						displayName:    'Definition',
						width:          '30%',
						columnChange:   function (row) {
							//同步tree structure 数据
							var operation = function (d) {
								angular.forEach(d.variable, function (param, key) {
									if (row.pid == param.pid) {
										param.formula = row.formula;
										//同步dtree数据
										$scope.$broadcast("updateDTree", row);
										return;
									}
								})
							};
							rootFirstTraversalStructure(operation);
						},
						columnTemplete: '<input type="text" ng-model="rowData[colData.field]"  style="width:100%;"  ng-change="colData.columnChange(rowData)" />'
					},
					{
						field:       'description',
						displayName: 'Description',
						width:       '20%'
					},
					{ field:         'category',
						displayName: 'Category',
						width:       '20%'
					}
				]
			}

			//we must watch attribute in a $scope.object, then the bothway binding will be establish
			$scope.$watch("variablesGridOption.selectedItems", function (newValue, oldValue) {
				$scope.selectedNodeParamData = $scope.NodeGridOption.selectedItems;
			});

			//初始化结构信息@todo delete

			//读取决策树数据函数
			$scope.selectDtreeData = function (name) {

				createDtreeService.get({DTreeParam: name},function (data) {
					console.log("$scope.selectDtreeData=", data);

					$scope.treeStructure = data.structure;
					$scope.treeConfig = data.config;
					$scope.treeParameter = data.parameter;

					$scope.canvasUiStyle = data.config.layout_style;

					$scope.generalGridData = [
						{"property": "name", "value": data.config.name}
						,
						{"property": "description", "value": data.config.description}
						,
						{"property": "creator", "value": $scope.user.local.email || $scope.user.facebook.name}
					]
				});
			}

			$scope.selectDtreeData($scope.DtreeId);

			function rootFirstTraversalStructure(operation) {
				var getChildren = function (d) {
					var d_children = d.children && d.children.length > 0 ? d.children : null;
					d_children = d._children && d._children.length > 0 ? d._children : null || d_children;
					return d_children;
				}
				var rootFirstTraversal = function (d) {
					if (!d) return;
					operation(d);
					var d_children = getChildren(d);
					if (d_children) {
						for (var i = 0; i < d_children.length; i++) {
							rootFirstTraversal(d_children[i]);
						}
					}
				}
				rootFirstTraversal($scope.treeStructure);
			}

			//打开一个对话框
			$scope.openClick = function (treedata, title) {
				var model = {};
				var options = {
					title:    title,
					autoOpen: false,
					modal:    true,
					height:   500,
					width:    400,
					close:    function (event, ui) {
						console.log("Predefined close");
					}
				};
				// Open the dialog
				dialogService.open("myDialog", "dialogTemplate.html", model, options)
					.then(
					function (result) {
						console.log("Close");
						console.log(result);
					},
					function (error) {
						console.log("Cancelled");
					}
				);
			};

			//给节点删除变量
			$scope.openDeleteParameterDialog = function () {
				if ($scope.selectedNodeParamData.length == 0) return;
				var model = $scope.selectedNodeParamData;
				var options = {
					autoOpen:  false,
					width:     600,
					resizable: false,
					modal:     true,
					title:     "confirm",
					buttons:   [
						{
							html:    "<i class='fa fa-trash-o'></i>&nbsp; Delete parameter",
							"class": "btn btn-danger",
							click:   function () {
								console.log(model);
								$scope.$apply(function() {
									angular.forEach(model, function (deleteparam) {
										//同步tree Properties表格数据
										angular.forEach($scope.treeParameter, function (treeParameter, index) {
											if (treeParameter.pid == deleteparam.pid) {
												$scope.treeParameter.splice(index, 1);
											}
										});
										//同步node definition表格数据
										angular.forEach($scope.NodeGridData, function (NodeGridData, index) {
											if (NodeGridData.pid == deleteparam.pid) {
												$scope.NodeGridData.splice(index, 1);
											}
										});
									})
								});
								//同步dtree数据
								$scope.$broadcast("resetDTree", model);
								//清空选中
								$scope.selectedNodeParamData = [];
								$(this).dialog("close");
							}
						},
						{
							html:    "<i class='fa fa-times'></i>&nbsp; Cancel",
							"class": "btn btn-default",
							click:   function () {
								$(this).dialog("close");

							}
						}
					]
				}
				// Open the dialog
				dialogService.open("addParameterDialog", "deleteParameterDialog.html", model, options);
			}

			//给节点添加变量--对话框
			$scope.openAddParameterDialog = function () {
				if ($scope.selectedNodeData == undefined) {
					return;
				}
				//计算当前最大id，理论上这种不断加1的方法会导致id随着不断修改而增加，最终会突破内存限制，不过我是看不到啦
				//在JavaScript中，不区别integer和float，全部为number类型。number类型在JavaScript中以64位（8byte）来存储。这64位中有符号位1位、指数位11位、实数位52位。
				//也就是在数字在2的53次方时，是最大值。其值为：9007199254740992（0x20000000000000）
				var maxIdObj = _.max($scope.treeParameter, function (treeParameter) {
					return treeParameter.pid
				});
				var maxId = maxIdObj.pid == undefined ? 1 : maxIdObj.pid + 1;

				var model = {
					"pid":         maxId,
					"name":        "",
					"formula":     "",
					"category":    "",
					"display":     true,
					"description": ""
				};
				// jQuery UI dialog options
				var options = {
					title:    "Add Node Parameter",
					autoOpen: false,
					modal:    true,
					height:   450,
					width:    500,
					close:    function (event, ui) {
						console.log("Predefined close");
					}
				};
				// Open the dialog
				dialogService.open("addParameterDialog", "addParameterDialog.html", model, options)
					.then(
					function (result) {
						$scope.treeParameter.push(result);
						$scope.NodeGridData.push(result);
						$scope.$broadcast("resetDTree", "wawa");

						console.log("Close");
					},
					function (error) {
						console.log("Cancelled");
					}
				);
			};

			//修改变量信息--对话框, 使用的是与增加变量相同的模版和控制器
			$scope.openEditParameterDialog = function () {
				if ($scope.selectedNodeData == undefined) {
					return;
				}
				if ($scope.selectedNodeParamData.length == 0){
					return;
				}
				var model = _.last($scope.selectedNodeParamData);
				console.log("openEditParameterDialog", model);
				// jQuery UI dialog options
				var options = {
					title:    "Edit Node Parameter",
					autoOpen: false,
					modal:    true,
					height:   450,
					width:    500,
					close:    function (event, ui) {
						console.log("Predefined close");
					}
				};
				// Open the dialog
				dialogService.open("addParameterDialog", "addParameterDialog.html", $scope.selectedNodeParamData[0], options)
					.then(
					function (result) {
						$scope.$broadcast("updateDTree", $scope.selectedNodeData);
						console.log("Close");
					},
					function (error) {
						console.log("Cancelled");
					}
				);
			};

			//监听canvasUiSwitch，设定界面样式
			$scope.$on("canvasUiSwitch", function (event, msg) {
				$scope.canvasUiStyle = msg;
				$scope.treeConfig.layout_style = $scope.canvasUiStyle;
			});


			//监听树的节点点击事件(点击.node, .infobox都会触发)
			$scope.$on("dtreeNodeClick", function (event, treedata) {
				console.log("dtreeNodeClick",event, treedata);
				$scope.$apply(function(){
					//如果切换了节点，则将所有选中信息重置
					if($scope.selectedNodeData != treedata){
						$scope.selectedNodeData = treedata;
						$scope.NodeGridData = $scope.selectedNodeData.variable;
						$scope.selectedNodeParamData = [];
					}
				})
			});

			//监听树的节点删除事件， 目的是删除节点
			$scope.$on("dtreeNodeDelete", function (event, treedata) {
				console.log(treedata.variable);
				$timeout(function () {
					angular.forEach(treedata.variable, function(v){
						angular.forEach($scope.treeParameter, function(p, i){
							if(v.pid == p.pid){
								$scope.treeParameter.splice(i, 1);
								return;
							}
						})
					})
					$scope.NodeGridData = [];
				}, 100);
			});

			//节点清除选中状态事件
			$scope.$on("dtreeNodeRemoveActiveStyle", function (event, data) {
				$scope.$apply(function(){
					$scope.NodeGridData = [];
					$scope.selectedNodeData = [];
					$scope.selectedNodeParamData = [];
					$scope.variablesGridOption.unSelectAllRowFuc();
					console.log("dtreeNodeRemoveActiveStyle", $scope.selectedNodeData);
				})
			});


			//监听树的infobox-p单击事件
			$scope.$on("infoboxPClick", function (event, param) {
				$timeout(function(){
					console.log("infoboxPClick", param);
					var pid = $(param).attr("pid");
					angular.forEach($scope.NodeGridData, function(obj, index){
						if(obj.pid == pid){
							$scope.selectedNodeParamData.push(obj);
							$scope.NodeGridOption.selectRowFuc(index, true);
							return;
						}
					})
					angular.forEach($scope.treeParameter, function(obj, index){
						if(obj.pid == pid){
							$scope.variablesGridOption.selectRowFuc(index, true);
							return;
						}
					})
				}, 100);
			});

			//监听树的infobox-p双击事件
			$scope.$on("infoboxPDblclick", function (event, param) {
				$timeout(function(){
					console.log("infoboxPDblclick", param);
//					var pid = $(param).attr("pid");
//					angular.forEach($scope.NodeGridData, function(obj, index){
//						if(obj.pid == pid){
//							$scope.selectedNodeParamData.push(obj);
//							$scope.NodeGridOption.selectRowFuc(index, true);
//							return;
//						}
//					})
//					angular.forEach($scope.treeParameter, function(obj, index){
//						if(obj.pid == pid){
//							$scope.variablesGridOption.selectRowFuc(index, true);
//							return;
//						}
//					})
					$scope.openEditParameterDialog();
				}, 100);

			});

			//监听树的打开计算窗口的事件
			$scope.$on("evaluationDialog", function (event, treedata) {
				console.log(treedata);
				$scope.openClick(treedata, "evaluation");
			});
			//监听树的打开payoff编辑窗口的事件
			$scope.$on("dtreePayoffEdit", function (event, treedata) {
				console.log(treedata);
				$scope.openClick(treedata, "payoff");
			});

		}
	]);

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