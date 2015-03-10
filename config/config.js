var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	dotenv = require('dotenv'),
	env = process.env.NODE_ENV || 'development';

dotenv.load();

var mongoBaseUri = null;

if (process.env.MONGOLAB_URI) {
	mongoBaseUri = process.env.MONGOLAB_URI;
}
else {
	mongoBaseuri = 'mongodb://localhost:27017/iflux-metrics';
}

var config = {
  development: {
    root: rootPath,
		timeZone: "Europe/Zurich",
		baseUrl: process.env.IFLUX_SERVER_URL || 'http://www.iflux.io',
		siteUrl: process.env.IFLUX_SITE_URL || 'http://www.iflux.io',
    app: {
      name: 'iflux-metrics-action-target'
    },
    port: process.env.PORT || 3002,
    db: mongoBaseUri + '-development'
  },

  test: {
    root: rootPath,
		timeZone: "Europe/Zurich",
		baseUrl: process.env.IFLUX_SERVER_URL || 'http://www.iflux.io',
		siteUrl: process.env.IFLUX_SITE_URL || 'http://www.iflux.io',
    app: {
      name: 'iflux-metrics-action-target'
    },
    port: process.env.PORT || 3002,
    db: mongoBaseUri + '-test'

  },

  production: {
    root: rootPath,
		timeZone: "Europe/Zurich",
		baseUrl: process.env.IFLUX_SERVER_URL || 'http://www.iflux.io',
		siteUrl: process.env.IFLUX_SITE_URL || 'http://www.iflux.io',
    app: {
      name: 'iflux-metrics-action-target'
    },
    port: process.env.PORT || 3002,
    db: mongoBaseUri + '-production'
  },

	docker: {
		root: rootPath,
		timeZone: "Europe/Zurich",
		baseUrl: process.env.IFLUX_SERVER_URL || 'http://www.iflux.io',
		siteUrl: process.env.IFLUX_SITE_URL || 'http://www.iflux.io',
		app: {
			name: 'iflux-metrics-action-target'
		},
		port: process.env.PORT || 3000,
		db: 'mongodb://mongo:' + process.env.MONGO_PORT_27017_TCP_PORT + '/' + (process.env.MONGO_DB || 'iflux-server-docker')
	}
};

module.exports = config[env];
