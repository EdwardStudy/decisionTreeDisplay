/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	//注册
	signup: function(req, res){
		var username = req.param('username');
		var	email = req.param('email');
		var	password = req.param('password');

        Users.findOne(username).exec(function(err, usr){
            if (err) {
                res.send(500, { error: "DB Error" });
            } else if (usr) {
                res.send(400, {error: "Username already Taken"});
                res.view('/');
            } else {
                var hasher = require("password-hash");
                password = hasher.generate(password);
                 
                Users.create({username: username, email:email, password: password}).exec(function(error, user) {
	                if (error) {
	                    res.send(500, {error: "DB Error"});
	                } else {
	                    req.session.user = user;
	                    res.send(user);
	                }
	            });
	        }
        });
	},
	
	//登录
	signin: function(req, res){
	    var email = req.param("email");
	    var password = req.param("password");
	     
	    Users.findOne(email).exec(function(err, usr) {
	        if (err) {
	            res.send(500, { error: "DB Error" });
	        } else {
	            if (usr) {
	                var hasher = require("password-hash");
	                if (hasher.verify(password, usr.password)) {
	                    req.session.user = usr;
	                    res.send(usr);
	                } else {
	                    res.send(400, { error: "Wrong Password" });
	                }
	            } else {
	                res.send(404, { error: "User not Found" });
	            }
	        }
	    });		
	},

	//回传
	callback: function(req, res){}
};

