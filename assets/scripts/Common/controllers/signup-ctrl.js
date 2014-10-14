define([
    '../../app',
], function(app){
    app.controller('cSignupCtrl', function($scope){
		//注册功能
		$scope.signup = function() {
			if($scope.email==null && $scope.password==null){
				alert("请填写注册用户名、邮箱或密码");
				return;
			}
			
			$.post("/signup", {
				username : $scope.username,
				email : $scope.email,
				password : $scope.password
			}).success(function(data, status, headers, config){
				var res = data;
				if(res.status != 0){
					if(res.status == 1){
						alert("E-mail已经被注册");
					}
				}else{
					location.href = '/#/';
				}
                 
			}).error(function(data, status, headers, config){
				alert(status);
			});
		};

    });
});