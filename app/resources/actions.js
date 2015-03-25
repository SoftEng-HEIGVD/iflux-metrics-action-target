var
	_ = require('underscore'),
	express = require('express'),
	router = express.Router(),
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
		console.log("Received " + actions.length + " actions on REST API.");

		_.each(actions, function (action) {
	    if (action.type === "updateMetric") {
	      var metric = action.properties.metric;

	      var timestamp = action.properties.timestamp;
	      if (timestamp === undefined) {
	        timestamp = new Date();
	      }

	      var value = action.properties.value;
	      if (value === undefined) {
	        value = 1;
	      }

	      var measure = new Measure(metric, value, timestamp);
	      router.app.analyticsProvider.reportMeasure(measure);
			}
		});
	}
	else {
		console.log("No action received on REST API.");
	}

  res.status(204).send();
});

