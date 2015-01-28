//var moment = require('moment');
var moment = require('moment-timezone');
var mongojs = require('mongojs');
var url = 'mongodb://localhost:27017/iflux';
var db = mongojs(url, ['metrics']);


/**
 * Represents a measure
 * @constructor
 * @param {string} metric - the name of the metric (e.g. 'number of events', 'temperature', 'number of critical exceptions')
 * @param {string} value - the value measured by a sensor (e.g. temperature) or 1 if the metric is a simple counter
 * @param {string} timestamp - the time at which the measure was taken
 */
var Measure = function (metric, value, timestamp) {
  this.metric = metric;
  this.value = value;
  this.timestamp = timestamp;
};


/**
 * Constructor for the service
 * @constructor
 */
var AnalyticsProvider = function (options) {

  /*
   * The analytics provider works in a specific timezone. This is important, for example, when defining
   * start and end date for a given interval. The timestamps associated to measures are always in UTC. The
   * start and end dates in the metrics documents are also in UTC. Hence, if the analytics provider works in
   * timezone 'Europe/Zurich' (UTC+1 in Winter, UTC+2 in Summer), then dates for the yearly metric document
   * of year 2011 are: start date: 2010-12-31 23:00:00.000Z, end date: 2011-12-31 22:59:59.999Z
   */
  if (options === undefined || options.timeZone === undefined) {
    this.timeZone = "CET";
  } else {
    this.timeZone = options.timeZone;
  }
};



AnalyticsProvider.prototype.getFacets = function (measure) {
  var facets = [];
  console.log(this);
  var ts = moment(measure.timestamp).tz(this.timeZone);
  console.log("*** year: " + ts.year());
  console.log("*** dayOfYear: " + ts.dayOfYear());
  console.log("*** month: " + ts.months());
  console.log("*** month2: " + moment().month());
  console.log("*** minute: " + ts.minute());
  //console.log(ts);

  /*
   * This will produce one document per year in a collection name 'metrics.382.yearly'. Each document will have a yearly total and
   * up to 12 monthly values (monthly.1, monthly.2, monthly.3, ..., monthly.12)
   */
  facets.push({
    collection: 'metrics.' + measure.metric + '.yearly',
    header: {
      metric: measure.metric,
      facet: 'yearly',
      startDate: moment(ts).startOf('year').toDate(),
      endDate: moment(ts).endOf('year').toDate(),
      timeZone: this.timeZone
    },
    levels: [
      {
        position: 'total'
      },
      {
        position: 'monthly.' + ts.month()
      }
    ]
  });

  facets.push({
    collection: 'metrics.' + measure.metric + '.daily',
    header: {
      metric: measure.metric,
      facet: 'daily',
      startDate: moment(ts).startOf('day').toDate(),
      endDate: moment(ts).endOf('day').toDate(),
      timeZone: this.timeZone
    },
    levels: [
      {
        position: 'total'
      },
      {
        position: 'hourly.' + ts.hour()
      },
      {
        position: 'minutely.' + ts.hour() + '.' + ts.minute()
      }
    ]
  });

  facets.push({
    collection: 'metrics.' + measure.metric + '.hourly',
    header: {
      metric: measure.metric,
      facet: 'hourly',
      startDate: moment(ts).startOf('hour').toDate(),
      endDate: moment(ts).endOf('hour').toDate(),
      timeZone: this.timeZone
    },
    levels: [
      {
        position: 'total'
      },
      {
        position: 'minutely.' + ts.minute()
      },
      {
        position: 'secondly.' + ts.minute() + '.' + ts.second()
      }
    ]
  });

  return facets;

};


AnalyticsProvider.prototype.reportMeasure = function (measure) {
  var facets = this.getFacets(measure);

  for (var i = 0; i < facets.length; i++) {
    var facet = facets[i];
    var delta = {
      $set: {},
      $inc: {},
      $min: {},
      $max: {}
    };
    delta.$set = {
      header: facet.header
    };
    for (var j = 0; j < facet.levels.length; j++) {
      var level = facet.levels[j];
      delta.$inc[level.position + '.count'] = 1;
      delta.$inc[level.position + '.sum'] = measure.value;
      delta.$min[level.position + '.min'] = measure.value;
      delta.$max[level.position + '.max'] = measure.value;
    };
    db.collection(facet.collection).update({
      header: delta.$set.header
    }, delta, {
      upsert: true
    }, function (err, doc, lastErrorObject) {
      console.log(err);
      console.log(doc);
    });

  }

};


AnalyticsProvider.prototype.getMetric = function (timestamp, callback) {
  var now = moment(timestamp);
  var startOfHour = moment(now).startOf('hour');
  var doc = db.metrics.findOne({
    'info.startDate': startOfHour.toDate()
  }, function (err, doc) {
    callback(doc);
  });
};


AnalyticsProvider.prototype.getMetrics = function (metric, granularity, timestamp, callback) {
  console.log("********* " + timestamp);
  console.log("********* " + moment(timestamp).tz('UTC').format());
  console.log("********* " + moment(timestamp).tz('Asia/tokyo').format());

  var collectionName = 'metrics.' + metric + '.' + granularity;
  var startOf;
  switch (granularity) {
  case 'hourly':
    startOf = 'hour';
    break;
  case 'daily':
    startOf = 'day';
    break;
  case 'monthly':
    startOf = 'month';
    break;
  case 'yearly':
    startOf = 'year';
    break;
  }
  var filter = {
    "header.startDate": moment(timestamp).startOf(startOf).toDate()
  };
  db.collection(collectionName).find(filter, function (err, metrics) {
    console.log(collectionName);
    console.log("********* " + moment(timestamp).tz('UTC').startOf(startOf).format());
    console.log(filter);
    console.log("Got query results");
    console.log(metrics);
    callback(null, metrics);
  });
};


exports.AnalyticsProvider = AnalyticsProvider;
exports.Measure = Measure;