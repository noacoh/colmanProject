const appRoot = require('app-root-path');

module.exports = {
  JWT_SECRET: 'colmanauthentication',// TODO generate secret string
  TOKEN_EXPIRATION: 1,
  resources:{
    docker: {
      temp: appRoot + '/resources/temp/docker',
      container_dir: appRoot + '/resources/temp/docker'
    },
    tasks: appRoot + '/resources/tasks',
    submissions: {
      temp: appRoot + '/resources/temp/submissions',
      root: appRoot + '/resources/submissions',
    },
    test_units: appRoot + '/resources/test units',
    ios: appRoot + '/resources/ios',
    logs: {
      app: appRoot + '/resources/logs/app.log',
      activity: appRoot + '/resources/logs/activity.log',
    },
    root: appRoot
  },
  server: {
    logs: {
      http: true
    }
  }
};
