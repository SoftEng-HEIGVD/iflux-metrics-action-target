var
	express = require('express'),
	router = express.Router();

/*
 * This module is responsible to process all HTTP requests sent to the /metrics
 * endpoint (and its subresources)
 */
module.exports = function (app) {
  router.app = app;
  app.use('/metrics/', router);
};

/**
 * When the client sends a request to /metrics, then return a JSON object that
 * contains the list of all available metrics.
 */
router.get('/', function (req, res, next) {
  router.app.analyticsProvider.getMetricsDescriptions(function (results) {
    res.render('metrics', {
      title: 'List of ' + results.length + ' metrics ',
      metrics : results
    });
  });
});
