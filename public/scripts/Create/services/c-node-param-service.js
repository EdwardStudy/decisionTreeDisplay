define([
	'../../app'
], function (app) {
	'use strict';
	app.factory('nodeParamService', [
		function () {
			var nodeParamArray = [];

			//过滤器
			var init = function (redefined_param_array, param_array) {
				if (!angular.isArray(redefined_param_array) || !angular.isArray(param_array)) {
					console.log("nodeArrayFilter: input data is not a array");
					return [];
				}

				var node_array = [];
				angular.forEach(redefined_param_array, function (obj) {
					for (var i = 0; i < param_array.length; i++) {
						if (obj.param_id == param_array[i].param_id) {
							node_array.push(param_array[i]);
						}
					}
				})
				return node_array;
			}

			//若要在服务器上创建资源，应该使用 POST 方法。
			//若要检索某个资源，应该使用 GET 方法。
			//若要更改资源状态或对其进行更新，应该使用 PUT 方法。
			//若要删除某个资源，应该使用 DELETE 方法。

			//save (create all)
			var saveNodeParamArray = function (redefined_param_array, param_array) {
				nodeParamArray = init(redefined_param_array, param_array);
			}

			//read
			var getNodeParamArray = function () {
				return nodeParamArray;
			}

			//add (create one)
			var postNodeParamArray = function (add_param) {
				nodeParamArray.push(add_param);
			}

			//update
			var updateNodeParamArray = function () {
				return nodeParamArray;
			}

			//delete
			var deleteNodeParamArray = function (delete_param) {
				angular.forEach(nodeParamArray, function (param, index) {
					if (param.param_id == delete_param.param_id) {
						nodeParamArray.splice(index, 1);
					}
				});
			}

			//reset
			var resetNodeParamArray = function () {
				nodeParamArray = [];
			}
			//synchronous
			var synNodeParamArray = function () {
				return nodeParamArray;
			}

			return {
				save:   saveNodeParamArray,
				get:    getNodeParamArray,
				post:   postNodeParamArray,
				update: updateNodeParamArray,
				delete: deleteNodeParamArray,
				reset:  resetNodeParamArray
			}
		}
	]);
});