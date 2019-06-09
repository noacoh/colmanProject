module.exports = {
  JWT_SECRET: 'colmanauthentication',// TODO generate secret string
  TOKEN_EXPIRATION: 1,
  RESOURCES:{
    DOCKER: {
      TEMP: '/resources/temp/docker'
    },
    TASKS: '/resources/tasks',
    SUBMISSIONS: '/resources/submissions',
    UNIT_TESTS: '/resources/unit test',
    LOGS: {
      HTTP: 'resources/logs/http'
    }
  }
};
