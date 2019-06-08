module.exports = {
  JWT_SECRET: 'colmanauthentication',// TODO generate secret string
  TOKEN_EXPIRATION: 1,
  RESOURCES:{
    DOCKER: {
      TEMP: '/resources/temp/docker'
    },
    TASKS: '/resources/tasks',
    SUBMISSIONS: '/resources/submissions',
    LOGS: '/resources/logs',
    UNIT_TESTS: '/resources/unit test'
  }
};
