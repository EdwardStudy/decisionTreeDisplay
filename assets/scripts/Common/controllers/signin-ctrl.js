define([
    '../../app',
], function(app){
	app.controller('cSigninCtrl', function($scope){
		//登录功能
		$scope.signin = function() {
			if($scope.email==null && $scope.password==null){
				alert("请填写登录邮箱或密码");
				return;
			}

			$.post("/signin", {
				email : $scope.email,
				password : $scope.password
			}).success(function(data, status, headers, config){
				var res = data;
				if(res.status != 0){
					if(res.status == 1){
						alert("密码输入错误"); 
					}else if(res.status == 2){
						alert("用户邮箱输入错误"); 
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