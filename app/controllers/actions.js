var express = require('express');
var router = express.Router();

var Measure = require('../services/analytics').Measure;
var analyticsProvider;

module.exports = function (app) {
  router.app = app;
  //analyticsProvider = app.analyticsProvider;
  app.use('/actions', router);
};

/* POST actions */
router.post('/', function (req, res) {
  var actions = req.body;

  console.log("Received " + actions.length + " actions on REST API.");
  console.log(this);
  
  for (var i = 0; i < actions.length; i++) {
    var action = actions[i];
    if (action.type === "updateMetric") {
      var metric = action.properties.metric;
      var timestamp = action.properties.timestamp;
      timestamp = new Date();
      var value = action.properties.value;
      
      var measure = new Measure(metric, value, timestamp);
      router.app.analyticsProvider.reportMeasure(measure);
    }
  }
  res.status(204).send();
});

