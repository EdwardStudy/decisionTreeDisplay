define([
	'../../app'
], function (app) {
	app.controller('createDTreeCtrl', [
		'$scope',
		'$http',
		'$timeout',
		'dialogService',
		'createDtreeService',
		'dtreeCrudService',
		'pubSubService',
		'tableService',
		'distrService',
		'$stateParams',
		function (
			$scope,
			$http,
			$timeout,
			dialogService,
			createDtreeService,
            dtreeCrudService,
			pubSubService,
			tableService,
			distrService,
			$stateParams
		) {
			//基础数据
			//获取Dtree ID
			$scope.DtreeId = $stateParams.project_id;
			console.log("$stateParams.project_id = ", $scope.DtreeId);
			//默认样式
			$scope.canvasUiStyle = "white-print";
			$scope.tree_config = undefined;
			$scope.node_array = undefined;
			$scope.param_array = undefined;
			$scope.param_category_array = undefined;
			$scope.distribution_array = undefined;
			$scope.payoff_array = undefined;


			//读取决策树数据函数
			$scope.selectDtreeData = function (name) {
				createDtreeService.get({DTreeParam: name}, function (data) {
					console.log("DATA = ", data);

					$scope.tree_config = data.config;
					$scope.node_array = deserialization(data.node_array);
					$scope.node_array = initRootNodeParam($scope.node_array, data.param_array);
					$scope.param_array = initParamArray(data.param_array, data.param_category_array);
					$scope.param_category_array = data.param_category_array;
					$scope.distribution_array = data.distribution_array;
					tableService.save(data.table_array);
					distrService.save(data.distribution_array);_
					$scope.payoff_array = data.payoff_array;

					$scope.canvasUiStyle = data.config.layout_style;

					$scope.generalGridData = [
						{"property": "name", "value": data.config.name}
						,
						{"property": "description", "value": data.config.description}
						,
						{"property": "creator", "value": $scope.user.local.email || $scope.user.facebook.name}
					];

				});
			}


            //将决策树数据存到后台数据库
            $scope.createDtreeData = function(){
                var data = {
                    "config":               $scope.tree_config,
                    "node_array":           $scope.node_array,
                    "param_array":          $scope.param_array,
                    "param_category_array": $scope.param_category_array,
                    "distribution_array":   $scope.distribution_array,
                    "table_array":          $scope.table_array,
                    "payoff_array":         $scope.payoff_array
                };
                //过滤掉node_array中的循环结构报错的parent
                data.node_array = omitParent(data.node_array);

                console.log('Info: createDtreeData: Omitted node_array = ', data.node_array);
                dtreeCrudService.save(data, function(res){
                    if(res.success){
                        console.log('Info: createDtreeData: Back-end successfully saved dtree = ', data);
                    }else{
                        console.log('Error: createDtreeData: Back-end failed to save dtree due to ', res.err);
                    }
                    //redirect to main screen
                    //$location.path('#/');
                }, function(error){
                    console.log("Error: createDtreeData: Fail to create due to ", error);
                });
            }

			//读取后台决策树数据函数，肖子达
			$scope.readDtreeData = function (){
				dtreeCrudService.get({dtree_id: '54a4c0947752adcc1764f0d4'}, function(res) {
                    if(res.success){
                        console.log("Info: readDtreeData: Back-end successfully read dtree = ", res.dtree);

                        $scope.tree_config = res.dtree.config;
                        //注释 从后台传过来已经是树结构
                        //$scope.node_array = deserialization(data.dtree.node_array);
                        $scope.node_array = initRootNodeParam($scope.node_array, res.dtree.param_array);
                        $scope.param_array = initParamArray(res.dtree.param_array, res.dtree.param_category_array);
                        $scope.param_category_array = res.dtree.param_category_array;
                        $scope.distribution_array = res.dtree.distribution_array;
                        $scope.table_array = res.dtree.table_array;
                        $scope.payoff_array = res.dtree.payoff_array;

                        $scope.canvasUiStyle = res.dtree.config.layout_style;

                        $scope.generalGridData = [
                            {"property": "name", "value": res.dtree.config.name}
                            ,
                            {"property": "description", "value": res.dtree.config.description}
                            ,
                            {"property": "creator", "value": $scope.user.local.email || $scope.user.facebook.name}
                        ];

                        console.log('Info: $scope.node_array = ', $scope.node_array);
                    }else{
                        console.log('Error: readDtreeData: Back-end failed to read dtree due to ', res.err);
                    }
				}, function(error){
                    console.log("Error: readDtreeData: Fail to read due to ", error);
                });
			}
			//写数据函数，肖子达
			$scope.updateDtreeData = function () {
				var data = {
					"config":               $scope.tree_config,
					"node_array":           $scope.node_array,
					"param_array":          $scope.param_array,
					"param_category_array": $scope.param_category_array,
					"distribution_array":   $scope.distribution_array,
					"table_array":          $scope.table_array,
					"payoff_array":         $scope.payoff_array
				};


                data.node_array = omitParent(data.node_array);

                console.log('Info: updateDtreeData: omitted node_array = ', data.node_array);
                dtreeCrudService.update({dtree_id: '54a4c0947752adcc1764f0d4'},data, function(res){
                    if(res.success){
                        console.log("Info: updateDtreeData: Back-end successfully update dtree = ", data);
                    }else{
                        console.log('Error: updateDtreeData: Back-end failed to read dtree due to ', res.err);
                    }
                    //redirect to main screen
                    //$location.path('#/');
                }, function(error){
                    console.log("Error: updateDtreeData: Fail to update due to ", error);
                });
			}

            //删除某个ID的决策树
            $scope.deleteDtreeData = function () {
                dtreeCrudService.delete({dtree_id: '54a4c0947752adcc1764f0d4'}, function(res){
                    if(res.success){
                        console.log("Info: deleteDtreeData: Back-end successfully delete dtree");
                    }else{
                        console.log('Error: updateDtreeData: Back-end failed to read dtree due to ', res.err);;
                    }
                    //redirect to main screen
                    //$location.path('#/');
                }, function(error){
                    console.log("Error: deleteDtreeData: Fail to delete due to ", error);
                });
            }

            //过滤掉树结构中的parent字段
            function omitParent(node){
                if(angular.isDefined(node.children) && node.children.length){
                    node.children = node.children.map(function(child){
                        //console.log('Test: omitParent: Check isDefined = ', children.parent);
                        if(angular.isDefined(child.parent)){
                            child =  _.omit(child,
                                "parent"
                            );
                        }
                        //console.log('Test: omitParent: pre later child = ', child);
                        return child = omitParent(child);
                    });
                }
                return node;
            }

            //检查是否存在循环引用
            function censor(censor) {
                var i = 0;

                return function(key, value) {
                    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
                        return '[Circular]';

                    if(i >= 231) // seems to be a harded maximum of 231 serialized objects in local config?
                        return '[Unknown]';

                    ++i; // so we know we aren't using the original object anymore

                    return value;
                }
            }


			//node_array的初始化操作
			var deserialization = function (node_array) {
				if (!angular.isArray(node_array)) {
					console.log("deserialization: input data is not a array");
					return {};
				}
				if (node_array.length == 0) {
					console.log("deserialization: input array is null");
					return {};
				}

//				for(var i=0; i<node_array.length; i++){
//					node_array[i] = _.pick(node_array[i], "node_id", "parent_id", "show_child");
//				}
//				console.log("过滤后的参数：", node_array);

				var temp_array = node_array;

				for (var i = 0; i < node_array.length; i++) {
					if (node_array[i].parent_id) {
						for (var j = 0; j < temp_array.length; j++) {
							if (node_array[i].parent_id == temp_array[j].node_id) {
								if (angular.isDefined(temp_array[j].children) == false)
									temp_array[j].children = [];
								if (angular.isDefined(temp_array[j]._children) == false)
									temp_array[j]._children = [];

								if (temp_array[j].show_child) {
									temp_array[j].children.push(node_array[i]);
								} else {
									temp_array[j]._children.push(node_array[i]);
								}
								break;
							}
						}
					}
				}
				return temp_array[0];
			}

			//给整个node结构拼接上root节点定义的变量
			var initRootNodeParam = function (node_array, param_array) {
				if (!angular.isDefined(node_array.redefined_param_array)) {
					console.log("initRootNodeParam: input node_array.redefined_param_array is not defined");
				}

				if (!angular.isArray(param_array)) {
					console.log("initRootNodeParam: input category_array is not a array");
					return [];
				}

				angular.forEach(param_array, function (p) {
					if (p.fomula != "") {
						node_array.redefined_param_array.push(_.pick(p, "param_id", "display", "name", "formula", "comment"));
					}
				});

				return node_array;
			}

			//param_array初始化机制
			var initParamArray = function (param_array, category_array) {
				if (!angular.isArray(param_array)) {
					console.log("initParamArray: input param_array is not a array");
					return [];
				}

				if (!angular.isArray(category_array)) {
					console.log("initParamArray: input category_array is not a array");
					return [];
				}

				angular.forEach(param_array, function (p) {
					angular.forEach(category_array, function (c) {
						if (p.category == null) {
							p.category_name = "";
						}
						if (p.category == c.category_id) {
							p.category_name = c.name;
						}

					})
				})

				return param_array;
			}

			//先根遍历node_array
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
				rootFirstTraversal($scope.node_array);
			}


			//选中节点的信息表格--NodeGrid
			$scope.selectedNodeData = undefined; //当前选中的节点
//			$scope.NodeGridData = nodeParamService.get();
			$scope.NodeGridData; // 当前选中的节点的所有变量数据
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
//					{
//						field:          'display',
//						displayName:    'show',
//						width:          '10%',
//						columnClick:    function (row) {
//							row.display = !row.display;
//							//同步tree Properties表格数据
//							angular.forEach($scope.param_array, function (param, key) {
//								if (row.param_id == param.param_id)
//									param.display = !param.display;
//							})
//							//同步dtree数据
//							$scope.$broadcast("updateDTree", row);
//						},
//						columnTemplete: '<input type="checkbox" ng-model="rowData[colData.field]" ng-click="colData.columnClick(rowData)"/>'
//					},
					{
						field:       'name',
						displayName: 'Name',
						width:       '20%'
					},
					{
						field:          'formula',
						displayName:    'ReDefined',
						width:          '30%',
						columnChange:   function (row) {
							//同步tree Properties表格数据
							angular.forEach($scope.param_array, function (param, key) {
								if (row.param_id == param.param_id)
									param.formula = row.formula;
							})
							//同步dtree数据
							$scope.$broadcast("updateDTree", row);
						},
						columnTemplete: '<input type="text" ng-model="rowData[colData.field]"  style="width:100%;" ng-change="colData.columnChange(rowData)" />'
					},
					{
						field:       'comment',
						displayName: 'Comment',
						width:       '20%'
					}
//					,
//					{ field:         'category',
//						displayName: 'Category',
//						width:       '20%'
//					}
				]
			};
			//表格选中项观测
			$scope.$watch("NodeGridOption.selectedItems", function (newValue, oldValue) {
				$scope.selectedNodeParamData = $scope.NodeGridOption.selectedItems;
			});

			//决策树全部变量表格--variablesGrid
			$scope.variablesGridOption = {
				angridStyle:              "th-list",
				canSelectRows:            true,  //允许选择
				multiSelect:              false,  //允许多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'param_array', //数据输入
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
								angular.forEach(d.redefined_param_array, function (param, key) {
									if (row.param_id == param.param_id) {
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
						displayName:    'Root Definition',
						width:          '30%',
						columnChange:   function (row) {
							//同步tree structure 数据
							var operation = function (d) {
								angular.forEach(d.redefined_param_array, function (param, key) {
									if (row.param_id == param.param_id) {
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
					{
						field:       'category_name',
						displayName: 'Category',
						width:       '20%'
					}
				]
			}
			//表格选中项观测
			$scope.$watch("variablesGridOption.selectedItems", function (newValue, oldValue) {
				$scope.selectedNodeParamData = $scope.NodeGridOption.selectedItems;
			});

			//决策树常规内容表格--genaralGrid
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
							$scope.tree_config[row.property] = row.value;
						},
						columnTemplete: '<input type="text" ng-model="rowData[colData.field]" style="width:100%;" ng-blur="colData.columnBlur(rowData)" />'
					}
				]
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
								$scope.$apply(function () {
									angular.forEach(model, function (deleteparam) {
										//同步tree Properties表格数据
										angular.forEach($scope.param_array, function (param_array, index) {
											if (param_array.param_id == deleteparam.param_id) {
												$scope.param_array.splice(index, 1);
											}
										});
										//同步node definition表格数据
//										nodeParamService.delete(deleteparam);
//										$scope.NodeGridData = nodeParamService.get();
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
				dialogService.open("addParameterDialog", "deleteDialog.html", model, options);
			}

			//给节点添加变量--对话框
			$scope.openAddParameterDialog = function () {
				if ($scope.selectedNodeData == undefined) {
					return;
				}
				//计算当前最大id，理论上这种不断加1的方法会导致id随着不断修改而增加，最终会突破内存限制，不过我是看不到啦
				//在JavaScript中，不区别integer和float，全部为number类型。number类型在JavaScript中以64位（8byte）来存储。这64位中有符号位1位、指数位11位、实数位52位。
				//也就是在数字在2的53次方时，是最大值。其值为：9007199254740992（0x20000000000000）
				var maxIdObj = _.max($scope.param_array, function (param_array) {
					return param_array.param_id
				});
				var maxId = maxIdObj.param_id == undefined ? 1 : maxIdObj.param_id + 1;

				var model = {
					"param_id":    maxId,
					"name":        "",
					"formula":     "",
					"category":    "",
					"display":     true,
					"description": "",
					"comment":     ""
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
						//同步tree Properties表格数据
						$scope.param_array.push(result);
						//同步node definition表格数据
//						nodeParamService.post(result);
//						$scope.NodeGridData = nodeParamService.get();
						$scope.NodeGridData.push(_.pick(result, "param_id", "display", "name", "formula", "comment"));
						//同步dtree数据
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
				if ($scope.selectedNodeParamData.length == 0) {
					return;
				}
				var model = _.last($scope.selectedNodeParamData);
				console.log("openEditParameterDialog", model);
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
				$scope.tree_config.layout_style = $scope.canvasUiStyle;
			});


			//监听树的节点点击事件(点击.node, .infobox都会触发)
			$scope.$on("dtreeNodeClick", function (event, treedata) {
				console.log("dtreeNodeClick", event, treedata);
				$scope.$apply(function () {
					//如果切换了节点，则将所有选中信息重置
					if ($scope.selectedNodeData != treedata) {
						$scope.selectedNodeData = treedata;
//						nodeParamService.save($scope.selectedNodeData.redefined_param_array, $scope.param_array);
//						$scope.NodeGridData = nodeParamService.get();
						$scope.NodeGridData = $scope.selectedNodeData.redefined_param_array;
						$scope.selectedNodeParamData = [];
					}
				})
			});

			//监听树的节点删除事件， 目的是删除节点
			$scope.$on("dtreeNodeDelete", function (event, treedata) {
				//同时删除该节点所囊括的变量
//				console.log(treedata.param_array);
//				$timeout(function () {
//					angular.forEach(treedata.param_array, function(v){
//						angular.forEach($scope.param_array, function(p, i){
//							if(v.param_id == p.param_id){
//								$scope.param_array.splice(i, 1);
//								return;
//							}
//						})
//					})
//					$scope.NodeGridData = [];
//				}, 100);
				$scope.$apply(function () {
					nodeParamService.reset();
					$scope.NodeGridData = nodeParamService.get();
				});
			});

			//节点清除选中状态事件
			$scope.$on("dtreeNodeRemoveActiveStyle", function (event, data) {
				$scope.$apply(function () {
//					nodeParamService.reset();
//					$scope.NodeGridData = nodeParamService.get();
					$scope.NodeGridData = [];
					$scope.selectedNodeData = [];
					$scope.selectedNodeParamData = [];
					$scope.variablesGridOption.unSelectAllRowFuc();
					console.log("dtreeNodeRemoveActiveStyle", $scope.selectedNodeData);
				})
			});


			//监听树的infobox-p单击事件
			$scope.$on("infoboxPClick", function (event, param) {
				$timeout(function () {
					console.log("infoboxPClick", param);
					var param_id = $(param).attr("param_id");
					angular.forEach($scope.NodeGridData, function (obj, index) {
						if (obj.param_id == param_id) {
							$scope.selectedNodeParamData.push(obj);
							$scope.NodeGridOption.selectRowFuc(index, true);
							return;
						}
					})
					angular.forEach($scope.param_array, function (obj, index) {
						if (obj.param_id == param_id) {
							$scope.variablesGridOption.selectRowFuc(index, true);
							return;
						}
					})
				}, 100);
			});

			//监听树的infobox-p双击事件
			$scope.$on("infoboxPDblclick", function (event, param) {
				$timeout(function () {
					console.log("infoboxPDblclick", param);
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

			//初始化
			$scope.selectDtreeData($scope.DtreeId);
		}
	]);

});