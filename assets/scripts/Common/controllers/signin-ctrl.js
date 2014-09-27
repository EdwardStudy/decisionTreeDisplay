define([
    '../../app',
], function(app){
    app.controller('cSigninCtrl', [
        '$scope',
        '$timeout',
        function($scope, $timeout){
        	

			$("#signinButton").click(function(){
			    var email = $("#email").val();
			    var password = $("#password").val();
			    console.log(email, password);
			    if (email && password) {
			        $.post(
			            '/signin',
			            {email: email, password:password},
			            function () {
			                window.location = "/#/";
			            }
			        ).fail(function(res){
			            alert("Error: " + res.getResponseHeader("error"));
			        });
			    } else {
			        alert("A e-mail and password is required");
			    }
			});


        }
    ]);
});