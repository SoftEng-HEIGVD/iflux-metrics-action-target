var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'iflux-metrics-action-target'
    },
    port: 3000,
    db: 'mongodb://localhost/iflux-metrics-action-target-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'iflux-metrics-action-target'
    },
    port: 3000,
    db: 'mongodb://localhost/iflux-metrics-action-target-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'iflux-metrics-action-target'
    },
    port: 3000,
    db: 'mongodb://localhost/iflux-metrics-action-target-production'
    
  }
};

module.exports = config[env];
