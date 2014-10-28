define([
    'routes',
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
        'app.task', //@todo delete
    ]).config([
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',//plus
        function(
          $routeProvider, 
          $locationProvider, 
          $controllerProvider, 
          $compileProvider, 
          $filterProvider, 
          $provide, 
          $stateProvider, 
          $urlRouterProvider, 
          $httpProvider
          ){
          //依赖延迟加载机制
          var dependenciesResolver = function(dependencies){
              var definition =
              {
                  resolver: function ($q, $rootScope) {
                      if(dependencies != undefined && dependencies != null){
                          var deferred = $q.defer();
                          require(dependencies, function () {
                              $rootScope.$apply(function () {
                                  deferred.resolve();
                              });
                          });
                          return deferred.promise;
                      }
                  }
              }
              return definition;
          }
          //延迟依赖加载同时用户验证
          var dependenciesResolverWithAuth = function(dependencies){
              var definition = dependenciesResolver(dependencies);
              //================================================
              // Check if the user is connected
             //===============================================

              definition.requiresSignin = function ($q, $timeout, $http, $state, $rootScope) {
                // Initialize a new promise
                var deferred = $q.defer();

                // Make an AJAX call to check if the user is logged in
                $http.get('/signedin').success(function (user) {
                  // Authenticated
                  if (user !== '0') {
                    $rootScope.user = user;
                    $timeout(deferred.resolve, 0);

                  // Not Authenticated
                  } else {
                    $rootScope.message = 'You need to log in.';
                    $timeout(function () { deferred.reject(); }, 0);
                    $state.go('/signin');
                  }
                });
                return deferred.promise;
              }
              return definition;
          }
          

          //================================================
          // An interceptor for AJAX errors
          //================================================
          $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
            return function (promise) {
              return promise.then(
                // Successs
                function (response) {
                  return response;
                },
                // Error 
                function (response) {
                  if (response.status === 401) {
                    var $state = $injector.get('$state');
                    $state.go('/signin');
                    return $q.reject(response);
                  }
                }
              );
            };
          }]);

          /////////////////////////////
	        // Redirects and Otherwise //
	        /////////////////////////////
	        
	        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        	if(config.defaultRoutePath !== undefined){
            	$urlRouterProvider.otherwise(config.defaultRoutePath);
          }
          	        
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;

            //$locationProvider.html5Mode(true);
            
        if(config.routes !== undefined){
            angular.forEach(config.routes, function(route, path){
                 $stateProvider.state(path,{
                      url: path,
                      templateUrl: route.templateUrl,                       
                      resolve:route.noAuth == true ?
                          dependenciesResolver(route.dependencies)
                          :
                          dependenciesResolverWithAuth(route.dependencies)
                  });
            });
        }    
    }])
    //全局控制器
    .controller('AppCtrl', [
        '$scope', '$location', function($scope, $location) {
            $scope.main = {
                brand: 'DTree',
                name: 'Lisa Doe'
            }
        }
    ])
    .controller('NavCtrl', [
        '$scope', 'taskStorage', 'filterFilter', function($scope, taskStorage, filterFilter) {
        	
        }
    ])
    .factory('Auth', ['$http', function ($http) {
      return {
        signout: function (success, error) {
          $http.post('/signout').success(success).error(error);
        }
      };
    }])
    .factory('Users', ['$http', function ($http) {
      return {
        list: function (success, error) {
          $http.get('/api/users').success(success).error(error);
        }
      };
    }]);

   return app;
});