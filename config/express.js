
/**
 * config/express.js
 */
 
'use strict';

var express = require('express');
var cons = require('consolidate');
// var mongoStore = require('connect-mongo')(express); // mongodb session store
// var path = require('path');

module.exports = function (app, config, passport) {

  // express app configuration
  app.configure(function () {

    // set ups for view engine
    app.engine('html', cons.underscore);
    app.set('view engine', 'html');
    app.set('views', config.root + '/public/views');

    app.set('port', process.env.PORT || 4000);
    app.use(express.static(config.root + '/public'));
    app.use(express.logger('dev'));
    //app.use(express.bodyParser());
    //instead
    //also can ignore warning:connect.multipart() will be removed in connect 3.0
    app.use(express.urlencoded());
    app.use(express.json());

    app.use(express.methodOverride());

    // setup for cookie based session
    app.use(express.cookieParser());
    app.use(express.cookieSession({
        secret: "thisisthefirstclasssecret",
    }));
    // app.use(express.csrf());
    // app.use(function(req, res, next) {
    //     res.cookie('XSRF-TOKEN', req.csrfToken());
    //     next();
    // });

    // app.use(express.session({ 
    //   secret: 'thisisthefirstclasssecrets', 
    //   store: new mongoStore({ url: config.db, collection: 'sessions'})
    // }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
  });
};