define([
	'../../app'
], function (app) {
	'use strict';
	app.factory('distrService', ['pubSubService',
		 function (pubSubService) {
			 var distr_array = [];

			 //若要在服务器上创建资源，应该使用 POST 方法。
			 //若要检索某个资源，应该使用 GET 方法。
			 //若要更改资源状态或对其进行更新，应该使用 PUT 方法。
			 //若要删除某个资源，应该使用 DELETE 方法。

			 //save (create all)
			 var saveDistrArray = function (data) {
				 if (!angular.isArray(data))
					 return;
				 distr_array = data;
				 pubSubService.publish("distr_array_updated");
			 }

			 //read
			 var getDistrArray = function () {
				 return distr_array;
			 }

			 //add (create one)
			 var postDistrArray = function (addItem) {
				 distr_array.push(addItem);
				 pubSubService.publish("distr_array_updated");
			 }

			 //update
			 var updateDistrArray = function () {
				 return distr_array;
			 }

			 //delete
			 var deleteDistrArray = function (delete_array) {
				 angular.forEach(delete_array, function (del) {
					 angular.forEach(distr_array, function(distr, index){
						 if(distr.distr_id == del.distr_id)
							 distr_array.splice(index, 1);
					 });
				 });
				 pubSubService.publish("distr_array_updated");
			 }

			 return {
				 save:   saveDistrArray,
				 get:    getDistrArray,
				 post:   postDistrArray,
				 update: updateDistrArray,
				 delete: deleteDistrArray
			 }
		 }
	]);
});