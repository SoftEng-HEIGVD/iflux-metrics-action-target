var express = require('express');
var router = express.Router();

module.exports = function (app) {
  router.app = app;
  app.use('/metrics/', router);
};


router.get('/:metric', function (req, res) {
  router.app.analyticsProvider.getMetrics(req.params.metric, 'hourly', new Date(), function (err, metrics) {
    res.send(metrics);
  });  
});
           
/**
 * GET metrics
 * 
 * GET http://localhost:3000/metrics/io.iflux.test.errors/daily/2016-12-31T22:59:59.999Z
 */
router.get('/:metric/:granularity/:timestamp', function (req, res) {
  
  router.app.analyticsProvider.getMetrics(req.params.metric, req.params.granularity, req.params.timestamp, function (err, metrics) {
    res.send(metrics);
  });
  
});
