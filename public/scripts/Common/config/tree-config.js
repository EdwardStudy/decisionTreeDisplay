define([
	'../../app'
], function (app) {
	app.factory('treeConfig', [ function () {
		//TreeConfig是决策树数据结构的默认定义，与数据库的数据结构相对应，用以新建决策树、新建节点、变量、table等对象时使用
		return {
			"config":      {
				"name":           "",
				"description":    "",
				"last_saved":     "",
				"security_level": "private",
				"layout_style":   "white-print",

				"layer_width": [],

				"show_title":    true,
				"show_info":     true,
				"show_param":    true,
				"show_tracker":  true,
				"show_payoff":   true,
				"show_tips":     true,
				"align_endArea": true
			},
			"param_array": [
				{
					"param_id":    1,
					"name":        "",
					"formula":     "",
					"category":    null,
					"display":     true,
					"description": "",
					"comment":     ""
				}
			],

			"param_category_array": [
				{
					"category_id": 1,
					"name":        "",
					"description": ""
				}
			],

			"table_array": [
				{
					"table_id":    1,
					"name":        "",
					"value":       [],
					"column":      1,
					"description": "",
					"comment":     ""
				}
			],

			"distribution_array": [
				{
					"distr_id":    1,
					"name":        "",
					"type":        "",
					"value":       [],
					"description": "",
					"category":    "",
					"comment":     ""
				}
			],

			"node_array": [
				{
					"node_id":               1,
					"parent_id":             null,
					"node_path_array":       [],
					"name":                  "",
					"tip":                   "",
					"type":                  "",
					"markov_info":           [],
					"show_child":            true,
					"show_tip":              true,
					"prob":                  "",
					"redefined_param_array": [],
					"tracker_array":         [],
					"payoff_array":          []
				}
			],

			"payoff_array": [
				{
					"payoff_id":   1,
					"name":        "",
					"weight":      1,
					"description": ""
				}
			],
			//给出当前最大ID，用于新建对象时使用
			"getMaxId":     function (array, key) {
				if (!angular.isArray(array)) {
					console.log("TreeConfig.getMaxId input must be an array, there is a bug");
					return 0;
				}
				if (array.length == 0) {
					return 1;
				}
				if (!angular.isDefined(array[0][key])) {
					console.log("TreeConfig.getMaxId could not find obj which key =" + key);
					return 0;
				}
				var maxIdObj = _.max(array, function (obj) {
					return obj[key];
				});
				return maxIdObj[key] + 1;
			}
		};

	}])
});

