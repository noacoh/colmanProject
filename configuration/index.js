const appRoot = require('app-root-path');

module.exports = {
  JWT_SECRET: 'colmanauthentication',// TODO generate secret string
  TOKEN_EXPIRATION: 1,
  resources:{
    docker: {
      temp: appRoot + '/resources/temp/docker'
    },
    tasks: appRoot + '/resources/tasks',
    submissions: appRoot + '/resources/submissions',
    test_units: appRoot + '/resources/test units',
    logs: {
      app: appRoot + 'resources/logs/app.log',
      activity: appRoot + 'resources/logs/activity.log',
    }
  },
  server: {
    logs: {
      http: true
    }
  }
};
