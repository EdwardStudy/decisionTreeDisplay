define([
	'../../app'
], function (app) {
	app.controller('createDTreeCtrl', [
		'$scope',
		'$http',
		'$timeout',
		'dialogService',
		'createDtreeService',
		'testService',
		function ($scope, $http, $timeout, dialogService, createDtreeService, testService) {
			////////////////////////////////////////////////////////////////////
			//树的数据
			$scope.treeData = {
				"id":                1,
				"name":              "晚上干嘛？",
				"type":              "decision",
				"change":            null,
				"markov_info":       null,
				"variable":          null,
				"tracker":           null,
				"payoff":            null,
				"compiled_prob":     null,
				"compiled_variable": null,
				"compiled_tracker":  null,
				"compiled_payoff":   null,
				"parsed_prob":       null,
				"parsed_variable":   null,
				"parsed_tracker":    null,
				"parsed_payoff":     null,
				"children":          [],
				"_children":         []
			};
/*
			$scope.treeData = {
//basic info
				"id":                1,
				"name":              "晚上干嘛？",   //单独显示于titleBox
				"type":              "decision",    //shape类型判断标志
				"change":            null,			//单独显示于probBox
				"markov_info":       null,			//？
//parameter list
				"variable":          null,
				"tracker":           null,
				"payoff":            null,
//compiled parameter values
				"compiled_prob":     null,
				"compiled_variable": null,
				"compiled_tracker":  null,
				"compiled_payoff":   null,
//parsed parameter values
				"parsed_prob":       null,
				"parsed_variable":   null,
				"parsed_tracker":    null,
				"parsed_payoff":     null,
//togglable children list
				"children":          [
					{
						"id":                2,
						"name":              "找妹子",
						"type":              "change",
						"change":            null,
						"markov_info":       null,
						"tip":               "啦啦啦啦啦",
						//variable 作为单个object, 以便于parse过程中需要scope的时候，merge其内容
						"variable":          {
							"cKTV":  "400",
							"cGift": "200"
						},
						"tracker":           null,
						"payoff":            null,
						"compiled_prob":     null,
						"compiled_variable": null,
						"compiled_tracker":  null,
						"compiled_payoff":   null,
						"parsed_prob":       null,
						"parsed_variable":   null,
						"parsed_tracker":    null,
						"parsed_payoff":     null,
						"children":          [
							{
								"id":                4,
								"name":              "约会",
								"type":              "change",
								"change":            "pDate",
								"markov_info":       null,
								"variable":          null,
								"tracker":           null,
								"payoff":            null,
								"compiled_prob":     null,
								"compiled_variable": null,
								"compiled_tracker":  null,
								"compiled_payoff":   null,
								"parsed_prob":       null,
								"parsed_variable":   null,
								"parsed_tracker":    null,
								"parsed_payoff":     null,
								"children":          [
									{
										"id":                6,
										"name":              "约会成功",
										"type":              "terminal",
										"change":            "pDateSuccess",
										"markov_info":       null,
										"variable":          null,
										"tracker":           null,
										"payoff":            {
											"payoff1": "cDate+cDateSuccess",
											"payoff2": "uDateSuccess"
										},
										"compiled_prob":     null,
										"compiled_variable": null,
										"compiled_tracker":  null,
										"compiled_payoff":   null,
										"parsed_prob":       null,
										"parsed_variable":   null,
										"parsed_tracker":    null,
										"parsed_payoff":     null,
										"children":          [],
										"_children":         null
									},
									{
										"id":                7,
										"name":              "炮灰",
										"type":              "terminal",
										"tip":               "奥拉奥拉奥拉奥拉",
										"change":            "#",
										"markov_info":       null,
										"variable":          null,
										"tracker":           null,
										"payoff":            {
											"payoff1": "cDate",
											"payoff2": "uDateFail"},
										"compiled_prob":     null,
										"compiled_variable": null,
										"compiled_tracker":  null,
										"compiled_payoff":   null,
										"parsed_prob":       null,
										"parsed_variable":   null,
										"parsed_tracker":    null,
										"parsed_payoff":     null,
										"children":          [],
										"_children":         null
									}
								],
								"_children":         null
							},
							{
								"id":                5,
								"name":              "逛街",
								"type":              "terminal",
								"change":            "#",
								"markov_info":       null,
								"variable":          null,
								"tracker":           null,
								"payoff":            {
									"payoff1": "cShopping",
									"payoff2": "uShopping"
								},
								"compiled_prob":     null,
								"compiled_variable": null,
								"compiled_tracker":  null,
								"compiled_payoff":   null,
								"parsed_prob":       null,
								"parsed_variable":   null,
								"parsed_tracker":    null,
								"parsed_payoff":     null,
								"children":          [],
								"_children":         null
							}
						],
						"_children":         null
					},
					{
						"id":                3,
						"name":              "找哥们",
						"type":              "change",
						"change":            null,
						"markov_info":       null,
						"variable":          {"pDinning": "30%"},
						"tracker":           null,
						"payoff":            null,
						"compiled_prob":     null,
						"compiled_variable": null,
						"compiled_tracker":  null,
						"compiled_payoff":   null,
						"parsed_prob":       null,
						"parsed_variable":   null,
						"parsed_tracker":    null,
						"parsed_payoff":     null,
						"children":          [
							{
								"id":                8,
								"name":              "喝酒",
								"type":              "terminal",
								"change":            "pDinning",
								"markov_info":       null,
								"variable":          null,
								"tracker":           null,
								"payoff":            {
									"payoff1": "cDinning",
									"payoff2": "uDinning"
								},
								"compiled_prob":     null,
								"compiled_variable": null,
								"compiled_tracker":  null,
								"compiled_payoff":   null,
								"parsed_prob":       null,
								"parsed_variable":   null,
								"parsed_tracker":    null,
								"parsed_payoff":     null,
								"children":          [],
								"_children":         null
							},
							{
								"id":                9,
								"name":              "上自习",
								"type":              "terminal",
								"change":            "10%",
								"markov_info":       null,
								"variable":          null,
								"tracker":           null,
								"payoff":            {
									"payoff1": "cStudy",
									"payoff2": "uStudy"
								},
								"compiled_prob":     null,
								"compiled_variable": null,
								"compiled_tracker":  null,
								"compiled_payoff":   null,
								"parsed_prob":       null,
								"parsed_variable":   null,
								"parsed_tracker":    null,
								"parsed_payoff":     null,
								"children":          [],
								"_children":         null
							},
							{
								"id":                10,
								"name":              "DOTA",
								"type":              "terminal",
								"change":            "#",
								"markov_info":       null,
								"variable":          null,
								"tracker":           null,
								"payoff":            {
									"payoff1": "cDOTA",
									"payoff2": "uDOTA"
								},
								"compiled_prob":     null,
								"compiled_variable": null,
								"compiled_tracker":  null,
								"compiled_payoff":   null,
								"parsed_prob":       null,
								"parsed_variable":   null,
								"parsed_tracker":    null,
								"parsed_payoff":     null,
								"children":          [],
								"_children":         null
							}
						],
						"_children":         null
					}
				],
				"_children":         null
			}
			*/
			//配置参数
			$scope.treeOptions = {
				"name":               "王二狗的决策树",
				"description":        "关于今晚干什么的人生重大决定",
				"last_saved":         "07/10/2014 09:10:53",
				//security level 决定树是否可以被共享，private不能被别人看到不能被修改， readable被同伴可见可分析不能修改，
				//modifiable被同伴可分析可修改, public任何人可见可修改
				"security_level":     "private",
				//layout style 记录用户所选树的外观
				"layout_style":       "white-print", //可能的值：white-print， blue-print

				//记录树整体结构的显示参数，此处以layer宽度为例
				"depth":              4,
				"layer_width":        [300, 220, 220, 234],

				//是否显示某些文字
				"show_title":         true,
				"show_info":          true,
				"show_default_info":  true,
				"show_compiled_info": true,
				"show_parsed_info":   true,
				"show_variable":      true,
				"show_tracker":       true,
				"show_payoff":        true
			};

//			$scope.treeData = createDtreeService.get({DTreeParam: "DTree-structure"}, function(data) {
//				console.log(data);
//			});

//			$timeout(function () {
//				$scope.treeData = testService.query();
//			}, 100);

			$scope.treeData = testService.query();


			//$scope.treeData = $scope.treeData_null;

			//监听canvasUiSwitch，设定界面样式
			$scope.canvasUiStyle = $scope.treeOptions.layout_style; //可能的值：white-print， blue-print
			$scope.$on("canvasUiSwitch", function (event, msg) {
				$scope.canvasUiStyle = msg;
			});

			$scope.initVariables = function (treedata) {
				var variables = [];
				if (treedata.variable) {
					//{“vid”: 1, name: “payoff1”, definition: [“=”, “cShopping”],  show: true, description: null},
					for (var i in treedata.variable) {
						variables.push({
							"vid":         1,
							"name":        i,
							"definition":  treedata.variable[i],
							"show":        true,
							"description": null,
							"category":    null
						})
					}
				}
				$scope.variablesData = variables;
				return $scope.variablesData;
			}


			$scope.variablesData = [];
			//树的变量显示
			$scope.variablesTableSetting = {
				angridStyle:              "th-list",
				canSelectRows:            false, //多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'variablesData', //数据输入
				columnDefs: 					 //用一个对象数组定义每一列
										  [
											  { field: 'name', displayName: 'Name', width: '20%'}
											  ,
											  { field: 'definition', displayName: 'Definition', width: '30%', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
											  ,
											  { field: 'description', displayName: 'Description', width: '20%'}
											  ,
											  { field: 'category', displayName: 'Category', width: '20%'}
											  ,
											  { field: 'show', displayName: 'show', width: '10%'}
										  ]
			}

			//监听树的节点点击事件
			$scope.$on("dtreeNodeClick", function (event, treedata) {
				//该自定义事件不会导致立即刷新，只得如此
				$timeout(function () {
					$scope.initVariables(treedata);
				}, 500);
			});

			//打开一个对话框
			$scope.openClick = function (treedata) {
				console.log(treedata);
				// The data for the dialog
				//$scope.initVariables(treedata);
				var model = $scope.variablesTableSetting;
				// jQuery UI dialog options
				var options = {
					title:    "variables",
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


			$scope.$on("infoboxDblclick", function (event, treedata) {
				console.log(treedata);
				$timeout(function () {
					$scope.openClick(treedata);
				}, 100);
			});

			$scope.$on("evaluationDialog", function (event, treedata) {
				console.log(treedata);
				$timeout(function () {
					$scope.openClick(treedata);
				}, 100);
			});

			//////////////////////////////////////////////////////////
			//测试
			$scope.resetTreeData = function () {
				$scope.treeData = {
					//basic info
					"id":                1,
					"name":              "晚上干嘛？",   //单独显示于titleBox
					"type":              "decision",    //shape类型判断标志
					"change":            null,			//单独显示于probBox
					"markov_info":       null,			//？
//parameter list
					"variable":          null,
					"tracker":           null,
					"payoff":            null,

//compiled parameter values
					"compiled_prob":     null,
					"compiled_variable": null,
					"compiled_tracker":  null,
					"compiled_payoff":   null,

//parsed parameter values
					"parsed_prob":       null,
					"parsed_variable":   null,
					"parsed_tracker":    null,
					"parsed_payoff":     null,
					children:            [],
					_children:           []
				}
			};
			//test data
			var data = {
				code:      200,
				"message": "OK",
				data:      [
					{
						id:             1,
						name:           "ABC",
						private_ip:     "10.0.0.2",
						flavor_name:    "m1.tiny",
						billing_type:   "包月",
						status:         "active",
						ssh_desp:       ".sina.sws.com:121001",
						floating_ips:   "124.114.110.14",
						key:            "my sk1",
						security_group: "sg1",
						image:          "centOS 64",
						snap:           1
					},
					{
						id:             2,
						name:           "wawa",
						private_ip:     "10.0.0.1",
						flavor_name:    "m1.tiny",
						billing_type:   "计时",
						status:         "loading",
						ssh_desp:       ".sina.sws.com:121001",
						floating_ips:   "124.114.110.15",
						key:            "my sk2",
						security_group: "sg1",
						image:          "centOS 64",
						snap:           2
					},
					{
						id:             3,
						name:           "ACE",
						private_ip:     "10.0.0.3",
						flavor_name:    "m1.tiny",
						billing_type:   "计时",
						status:         "danger",
						ssh_desp:       ".sina.sws.com:121001",
						floating_ips:   "124.114.110.16",
						key:            "my sk3",
						security_group: "sg1",
						image:          "centOS 64",
						snap:           3
					}
					,
					{
						id:             3,
						name:           "ACE",
						private_ip:     "10.0.0.3",
						flavor_name:    "m1.tiny",
						billing_type:   "计时",
						status:         "danger",
						ssh_desp:       ".sina.sws.com:121001",
						floating_ips:   "124.114.110.16",
						key:            "my sk3",
						security_group: "sg1",
						image:          "centOS 64",
						snap:           3
					}
					,
					{
						id:             3,
						name:           "ACE",
						private_ip:     "10.0.0.3",
						flavor_name:    "m1.tiny",
						billing_type:   "计时",
						status:         "danger",
						ssh_desp:       ".sina.sws.com:121001",
						floating_ips:   "124.114.110.16",
						key:            "my sk3",
						security_group: "sg1",
						image:          "centOS 64",
						snap:           3
					}
					,
					{
						id:             3,
						name:           "ACE",
						private_ip:     "10.0.0.3",
						flavor_name:    "m1.tiny",
						billing_type:   "计时",
						status:         "danger",
						ssh_desp:       ".sina.sws.com:121001",
						floating_ips:   "124.114.110.16",
						key:            "my sk3",
						security_group: "sg1",
						image:          "centOS 64",
						snap:           3
					}
					,
					{
						id:             3,
						name:           "ACE",
						private_ip:     "10.0.0.3",
						flavor_name:    "m1.tiny",
						billing_type:   "计时",
						status:         "danger",
						ssh_desp:       ".sina.sws.com:121001",
						floating_ips:   "124.114.110.16",
						key:            "my sk3",
						security_group: "sg1",
						image:          "centOS 64",
						snap:           3
					}
					,
					{
						id:             3,
						name:           "ACE",
						private_ip:     "10.0.0.3",
						flavor_name:    "m1.tiny",
						billing_type:   "计时",
						status:         "danger",
						ssh_desp:       ".sina.sws.com:121001",
						floating_ips:   "124.114.110.16",
						key:            "my sk3",
						security_group: "sg1",
						image:          "centOS 64",
						snap:           3
					}
				]
			};
			$scope.mySelections = [];
			$scope.myData = [];
			$scope.myData = data.data;
			//demo3, use default width ( no cssClass & width set )
			$scope.angridOptions = {
				angridStyle:              "th-list",
				multiSelectRows:          false, //多选
				displaySelectionCheckbox: false, //不显示多选框
				data:                     'myData', //数据输入
				selectedItems:            $scope.mySelections, //返回选中对象
				columnDefs: 					 //用一个对象数组定义每一列
										  [

											  { field: 'name', displayName: 'Name', width: '20%'}
											  ,
											  { field: 'private_ip', displayName: 'Description', width: '30%', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
											  ,
											  { field: 'billing_type', displayName: 'Root Definition', width: '20%'}
											  ,
											  { field: 'status', displayName: 'Category', width: '20%', columnFilter: 'instance_status'}
											  ,
											  { field: 'flavor_name', displayName: 'show', width: '10%'}
										  ]
			}

			//we must watch attribute in a $scope.object, then the bothway binding will be establish
			$scope.$watch("angridOptions.selectedItems", function (newValue, oldValue) {
				$scope.mySelections = $scope.angridOptions.selectedItems;
			});
			/////////////////////////////////////////////////////////
		}
	]);

	app.controller('dialogCtrl', ['$scope', 'dialogService',
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