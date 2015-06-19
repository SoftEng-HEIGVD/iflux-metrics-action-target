var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	dotenv = require('dotenv'),
	env = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV != 'docker') {
	dotenv.load();
}

var mongoBaseUri = null;

if (process.env.MONGOLAB_URI) {
	mongoBaseUri = process.env.MONGOLAB_URI;
}
else {
	if (process.env.MONGODB_HOST) {
		mongoBaseUri = 'mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/iflux-metrics';
	}
	else {
		mongoBaseUri = 'mongodb://localhost:27017/iflux-metrics';
	}
}

var config = {
  development: {
    root: rootPath,
		timeZone: "Europe/Zurich",
    app: {
      name: 'iflux-metrics-action-target',
	    actionType: process.env.METRICS_ACTION_TYPE
    },
    port: process.env.PORT || 3002,
    db: mongoBaseUri + '-development'
  },

  test: {
    root: rootPath,
		timeZone: "Europe/Zurich",
    app: {
      name: 'iflux-metrics-action-target',
	    actionType: process.env.METRICS_ACTION_TYPE
    },
    port: process.env.PORT || 3002,
    db: mongoBaseUri + '-test'
  },

  production: {
    root: rootPath,
		timeZone: "Europe/Zurich",
    app: {
      name: 'iflux-metrics-action-target',
	    actionType: process.env.METRICS_ACTION_TYPE
    },
    port: process.env.PORT || 3002,
    db: mongoBaseUri + '-production'
  },

	docker: {
		root: rootPath,
		timeZone: "Europe/Zurich",
		app: {
			name: 'iflux-metrics-action-target',
			actionType: process.env.METRICS_ACTION_TYPE
		},
		port: 3000,
		db: 'mongodb://mongo:' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/iflux-server-docker'
	}
};

module.exports = config[env];
