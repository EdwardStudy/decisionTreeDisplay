define([
    '../../app'
], function (app) {

    app.controller('SignupController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
      init();
      $scope.signup = function () {
        $http
        .post('/signup', $scope.signupData)
        .success(function (data, status, headers, config) {
          //$state.go('user.home');
          $state.go('/signin');
        })
        .error(function (data, status, headers, config) {
          $scope.signupForm.serverError = {
            message : 'Error: Attempt failed'
          };
          if (data.message) {
            $scope.signupForm.serverError.message = data.message;
          }
        });
      };

      function init() {
        $scope.signupData = {}; 
      }
    }])
    
});
