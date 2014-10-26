define([
	'../../app'
], function (app) {
	'use strict';
	//A factory which creates a resource object that lets you interact with RESTful server-side data sources.
	app.factory('createDtreeService', ['$resource',
		//https://docs.angularjs.org/api/ngResource/service/$resource
		function ($resource) {
//			return $resource(
//				'testjson/:DTreeParam.json', //to find app/testjson/*.json
//				{},
//				{
//					query: {method: 'GET', params: {DTreeParam: 'phones'}, isArray: true}
//				}
//			);
			var DtreeData = $resource('testjson/:DTreeParam.json',  {});
			//DtreeData.get({DTreeParam: 'phones'});
			return DtreeData;
		}
	]);

	app.factory('testService', ['$resource',
		function ($resource) {
			var instancesData = {
				"_comment":          "//注释：Dtree-structure,定义决策树的树型结构",
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

				"children":          [
					{
						"id":                2,
						"name":              "找妹子",
						"type":              "change",
						"change":            null,
						"markov_info":       null,
						"tip":               "啦啦啦啦啦",

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
											"payoff2": "uDateFail"
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
						"variable":          {
							"pDinning": "30%"
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
			};
			var sampleData = {
				//basic info
				"id":                1,
				"name":              "shit？",      //单独显示于titleBox
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
			};
			var testService = {};
			testService.instancesData = function(cb){
				return instancesData;
			};
			testService.sampleData = function(cb){
				return sampleData;
			};
			return testService;

		}
	]);

});