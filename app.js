var express = require('express'),
  config = require('./config/config'),
  glob = require('glob');
var AnalyticsProvider = require('./app/services/analytics').AnalyticsProvider;

var app = express();

app.analyticsProvider = new AnalyticsProvider(config);

require('./config/express')(app, config);
app.listen(config.port);