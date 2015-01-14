define([
	'../../app'
], function (app) {
	'use strict';
	//A factory which creates a resource object that lets you interact with RESTful server-side data sources.
	app.factory('dtreeCrudService', ['$resource',
		//https://docs.angularjs.org/api/ngResource/service/$resource
		function ($resource) {
			//注意服务器port改变时，这里的端口4000需要改变
			var DtreeData = $resource('http://localhost\\:4000/dtree/:dtree_id', {},{
                'get': {
                    method:'GET'
                },
                update: {
                    method: 'PUT' //a PUT request
                },
                'delete': {
                    method:'DELETE'
                }
            });
			return DtreeData;
		}
	]);
});