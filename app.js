var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');
var AnalyticsProvider = require('./app/services/analytics').AnalyticsProvider;

/*
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
*/


var app = express();

app.analyticsProvider = new AnalyticsProvider({
  timeZone: "Europe/Zurich"
});


require('./config/express')(app, config);
app.listen(config.port);