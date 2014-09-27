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
        'anGrid',
        'ui.bootstrap',
        'app.directives',
        'app.localization',
        'app.filter',//@todo delete
        'app.task' //@todo delete
    ]).config([
        //config中提供了一个lazyload读取模块模版、控制器和指令的方法
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide){
            //lazyload controller, directive, filter, factory, service
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;

            $locationProvider.html5Mode(true);

            if(config.routes !== undefined){
                angular.forEach(config.routes, function(route, path){
                    if(route.dependencies == undefined || route.dependencies == null){
                        //基于只加载模版的情况做了改良
                        $routeProvider.when(path, {templateUrl:route.templateUrl});
                    }else{
                        $routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)});
                    }
                });
            }

            if(config.defaultRoutePaths !== undefined){
                $routeProvider.otherwise({redirectTo:config.defaultRoutePaths});
            }
        }
    ]).controller('AppCtrl', [
        '$scope', '$location', function($scope, $location) {
            return $scope.main = {
                brand: 'DTree',
                name: 'Lisa Doe'
            };
        }
    ]).controller('NavCtrl', [
        '$scope', 'taskStorage', 'filterFilter', function($scope, taskStorage, filterFilter) {
//            var tasks;
//            tasks = $scope.tasks = taskStorage.get();
//            $scope.taskRemainingCount = filterFilter(tasks, {
//                completed: false
//            }).length;
//            return $scope.$on('taskRemaining:changed', function(event, count) {
//                return $scope.taskRemainingCount = count;
//            });
        }
    ]);

   return app;
});