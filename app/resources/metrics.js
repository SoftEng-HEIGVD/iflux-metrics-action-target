var
	express = require('express'),
	router = express.Router();

/*
 * This module is responsible to process all HTTP requests sent to the /metrics
 * endpoint (and its subresources)
 */
module.exports = function (app) {
  router.app = app;
  app.use('/', router);
};

/**
 * This function asks the analytics service to extract the metrics data from persistent storage
 * and sends the result back to the HTTP client. This function is called by other routes, which
 * define default values for the metric, granularity and timestamp values.
 */
var getMetrics = function (metric, granularity, timestamp, req, res) {
  router.app.analyticsProvider.getMetrics(metric, granularity, timestamp, function (err, metrics) {
    res.send(metrics);
  });
};

router.get('/:metric/currentMinute', function (req, res) {
  getMetrics(req.params.metric, 'minutely', new Date(), req, res);
});

router.get('/:metric/currentHour', function (req, res) {
  getMetrics(req.params.metric, 'hourly', new Date(), req, res);
});

router.get('/:metric/currentDay', function (req, res) {
  getMetrics(req.params.metric, 'daily', new Date(), req, res);
});

router.get('/:metric/currentMonth', function (req, res) {
  getMetrics(req.params.metric, 'monthly', new Date(), req, res);
});

router.get('/:metric/currentYear', function (req, res) {
  getMetrics(req.params.metric, 'yearly', new Date(), req, res);
});

/** The client has specified values for all parameters */
router.get('/:metric/:granularity/:timestamp', function (req, res) {
  getMetrics(req.params.metric, req.params.granularity, req.params.timestamp, req, res);
});

/** The client has not specified a reference timestamp, so we consider the current period */
router.get('/:metric/:granularity', function (req, res) {
  getMetrics(req.params.metric, req.params.granularity, new Date(), req, res);
});

/** The client has only specified a metric name, so we send the values for the current day */
router.get('/:metric', function (req, res) {
  getMetrics(req.params.metric, 'daily', new Date(), req, res);
});