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

		//状态码 0为成功， 1为email已经注册
        Users.findOne(email).exec(function(err, usr){
            if (err) {
                res.send(500, { error: "DB Error" });
            } else if (usr) {
            	console.log('Create user with email' + usr.email);
                res.json({status: 1});
            } else {
                var hasher = require("password-hash");
                password = hasher.generate(password);
                 
                Users.create({username: username, email:email, password: password}).exec(function(error, usr) {
	                if (error) {
	                    res.send(500, {error: "DB Error"});
	                } else {
	                    req.session.user = usr;
	                    console.log('Create user ' + usr.username);
	                    res.json({status: 0});
	                }
	            });
	        }
        });
	},
	
	//登录
	signin: function(req, res){
	    var email = req.param("email");
	    var password = req.param("password");
	    //状态码 0为成功， 1为密码错误， 2为登录邮箱错误
	    Users.findOne({email: email}).exec(function (err, usr) {
	        if (err) {
	            res.json({ error: "DB Error" });
	        } else {
	            if (usr) {
	                var hasher = require("password-hash");
	                if (hasher.verify(password, usr.password)) {
	                    req.session.user = usr;
	                    res.json({status: 0});
	                } else {
	                    res.json({status: 1 });
	                }
	            } else {
	                res.json({status: 2 });
	            }
	        }
	    });		
	},

	//登出·
	logout: function (req, res) {
		req.session.user = null;
	},

	  //访问控制
	  checkSignin: function(req, res,next){
	    if(!req.session.user){
	      req.json({error: "未登录"});
	      return res.redirect('/#/signin');
	    }
	    next();
	  },

	  checkNotSignin: function (req, res, next){
	    if(req.session.user){
	      req.json({error: "已登录"});
	      return res.redirect('/#/');
	    }
	    next();
	  },

	//回传
	callback: function(req, res){}
};

