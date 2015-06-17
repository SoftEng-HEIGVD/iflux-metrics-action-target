var express = require('express');
var glob = require('glob');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

module.exports = function (app, config) {
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

	app.locals.config = config;

	app.use(function(req, res, next) {
		var contextRoot = req.headers['x-context-root'];

		if (contextRoot) {
			if (contextRoot.indexOf('/', contextRoot.length - 1) !== -1) {
				contextRoot = contextRoot.substr(0, contextRoot.length - 2);
			}

			if (contextRoot.indexOf('/') === 0) {
				app.locals.contextRoot = contextRoot;
			}
			else {
				app.locals.contextRoot = '/' + contextRoot;
			}
		}
		else {
			app.locals.contextRoot = '';
		}

		next();
	});

	app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  // enable CORS
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    console.log(controller);
    require(controller)(app);
  });

	var resources = glob.sync(config.root + '/app/resources/*.js');
 resources.forEach(function (resource) {
   console.log(resource);
   require(resource)(app);
 });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

};