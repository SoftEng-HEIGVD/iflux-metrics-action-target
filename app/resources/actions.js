var
	_ = require('underscore'),
	express = require('express'),
	router = express.Router(),
	config = require('../../config/config'),
	Measure = require('../services/analytics').Measure;

module.exports = function (app) {
  router.app = app;
  //analyticsProvider = app.analyticsProvider;
  app.use('/actions', router);
};

/* POST actions */
router.post('/', function (req, res) {
  var actions = req.body;

  if (actions.length > 0) {
		console.log('Received %s actions on REST API.', actions.length);

		_.each(actions, function (action) {
			console.log(action);

			console.log('%s vs. %s', action.type, config.app.actionType);

	    if (action.type === config.app.actionType) {
	      var metric = action.payload.metric;

	      var timestamp = action.payload.timestamp;
	      if (timestamp === undefined) {
	        timestamp = new Date();
	      }

	      var value = action.payload.value;
	      if (value === undefined) {
	        value = 1;
	      }

	      var measure = new Measure(metric, value, timestamp);

		    console.log(measure);

		    router.app.analyticsProvider.reportMeasure(measure);
			}
		});
	}
	else {
		console.log('No action received on REST API.');
	}

  res.status(204).send();
});

