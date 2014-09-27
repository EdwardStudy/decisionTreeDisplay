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

        Users.findOne(email).exec(function(err, usr){
            if (err) {
                res.send(500, { error: "DB Error" });
            } else if (usr) {
            	console.log('Create usr with email' + usr.email);
                res.send(400, {error: "Username already Taken"});
            } else {
                var hasher = require("password-hash");
                password = hasher.generate(password);
                 
                Users.create({username: username, email:email, password: password}).exec(function(error, usr) {
	                if (error) {
	                    res.send(500, {error: "DB Error"});
	                } else {
	                    req.session.user = usr;
	                    console.log('Create usr ' + usr.username);
	                    res.send(usr);
	                }
	            });
	        }
        });
	},
	
	//登录
	signin: function(req, res){
	    var email = req.param("email");
	    var password = req.param("password");
	     
	    Users.findOne({email: email}).exec(function (err, usr) {
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
	                res.send(404, { error: "User for this email not Found" });
	            }
	        }
	    });		
	},

	//登出·
  logout: function (req, res) {
    req.session = null
    res.redirect('/');
  },

	//回传
	callback: function(req, res){}
};

