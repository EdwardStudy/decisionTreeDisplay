define([
	'../../app'
], function (app) {
	'use strict';
	app.factory('tableService', ['pubSubService',
		 function (pubSubService) {
			 var table_array = [];

			 //若要在服务器上创建资源，应该使用 POST 方法。
			 //若要检索某个资源，应该使用 GET 方法。
			 //若要更改资源状态或对其进行更新，应该使用 PUT 方法。
			 //若要删除某个资源，应该使用 DELETE 方法。

			 //save (create all)
			 var saveTableArray = function (data) {
				 if (!angular.isArray(data))
					 return;
				 table_array = data;
				 pubSubService.publish("table_array_updated");
			 }

			 //read
			 var getTableArray = function () {
				 return table_array;
			 }

			 //add (create one)
			 var postTableArray = function (addItem) {
				 table_array.push(addItem);
				 pubSubService.publish("table_array_updated");
			 }

			 //update
			 var updateTableArray = function () {
				 return table_array;
			 }

			 //delete
			 var deleteTableArray = function (delete_array) {
				 angular.forEach(delete_array, function (del) {
					 angular.forEach(table_array, function(table, index){
						 if(table.table_id == del.table_id)
							 table_array.splice(index, 1);
					 });
				 });
				 pubSubService.publish("table_array_updated");
			 }

			 return {
				 save:   saveTableArray,
				 get:    getTableArray,
				 post:   postTableArray,
				 update: updateTableArray,
				 delete: deleteTableArray
			 }
		 }
	]);
});