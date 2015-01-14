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

});