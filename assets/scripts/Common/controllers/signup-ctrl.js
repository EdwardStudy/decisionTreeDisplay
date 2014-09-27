define([
    '../../app',
], function(app){
    app.controller('cSignupCtrl', [
        '$scope',
        '$timeout',
        function($scope, $timeout){

		    $("#signupButton").click(function(){
			    var username = $("#username").val();
			    var email = $("#email").val();
			    var password = $("#password").val();
			    if (username && email && password) {
			            $.post(
			                '/signup',
			                {username: username, email:email, password:password},
			                function () {
			                    window.location = "/#/signin";
			                }
			            ).fail(function(res){
			                alert("Error: " + res.getResponseHeader("error"));
			            });
			    } else {
			        alert("A username and password is required");
			    }
			});


        }
    ]);
});