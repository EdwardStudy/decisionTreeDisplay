define([
    '../../app'
], function (app) {

    app.controller('LogoutController', ['$scope', '$http', '$state', function ($scope, $http, $state, Auth) {
    	Auth.signout;

	    function logout() {
	        $http.post('/signout').success(success).error(error);
	    }

    }]);
});
