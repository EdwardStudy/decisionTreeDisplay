define([
    'routes',
    'Common/services/dependencyResolverFor',
    'Common/directives/app-directives',
    'Common/directives/app-localize',
    'Common/filter/app-filter', //@todo delete
    'Common/factorys/Task' //@todo delete
], function(
    config,
    dependencyResolverFor
    ){

    var app = angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
		'ngResource',
		'ui.router',
        'anGrid',
        'ui.bootstrap',
        'app.directives',
        'app.localization',
        'app.filter',//@todo delete
        'app.task' //@todo delete
    ]).config([
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$stateProvider',
        '$urlRouterProvider',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider, $urlRouterProvider){
        	/////////////////////////////
	        // Redirects and Otherwise //
	        /////////////////////////////
	        
	        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        	if(config.defaultRoutePath !== undefined){
            	$urlRouterProvider.otherwise(config.defaultRoutePath);
            }
            
        	//////////////////////////
	        // State Configurations //
	        //////////////////////////
	        // Use $stateProvider to configure your states.
	        $stateProvider.state('view1',{
	            url: '/view1',
	            templateUrl: 'partials/partial1.html'
	        })
	        .state('view2',{
	            url: '/view2',
	            templateUrl: 'partials/partial2.html'
	        })
	        .state('view3',{
	            url: '/view3',
	            templateUrl: 'partials/partial3.html'
	        });
	        
	        
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;

            //$locationProvider.html5Mode(true);
            
            if(config.routes !== undefined){
                angular.forEach(config.routes, function(route, path){
                    if(route.dependencies == undefined || route.dependencies == null){
                        //基于只加载模版的情况做了改良
                       $stateProvider.state(path,{
				            url: path,
				            templateUrl: route.templateUrl
				       });
                        
                    }else{
                    	$stateProvider.state(path,{
				            url: path,
				            templateUrl: route.templateUrl,
				            resolve:dependencyResolverFor(route.dependencies)
				       });
                    }
                });
            }
            
            
            
    }]).controller('AppCtrl', [
        '$scope', '$location', function($scope, $location) {
            return $scope.main = {
                brand: 'DTree',
                name: 'Lisa Doe'
            };
        }
    ]).controller('NavCtrl', [
        '$scope', 'taskStorage', 'filterFilter', function($scope, taskStorage, filterFilter) {
        	
        }
    ]);

   return app;
});