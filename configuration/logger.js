const logger = require('winston');
const { format } = logger;
const { combine, timestamp, label, printf, prettyPrint } = format;

const activityLogFormat = printf(({ level, message, timestamp, id }) => {
    return `${timestamp} ${level} ${id} : ${message}`;
});

const { resources } = require('index');
// define the custom settings for each transport (file, console)
const options = {
    file: {
        app: {
            level: 'info',
            filename: resources.logs.app,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        },
        usersActivity: {
            level: 'info',
            filename: resources.logs.activity,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        },
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

logger.loggers.add('logger', {
    transports: [
        new logger.transports.File(options.file.app),
        new logger.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});
logger.loggers.add('usersactivity', {
    format: combine(
        timestamp(),
        activityLogFormat,
        prettyPrint()
    ),
    transports: [
        new logger.transports.File(options.file.usersActivity),
        new logger.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

const logger = logger.loggers.get('logger');
const usersActivityLogger = logger.loggers.get('logger');

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = {
    logger,
    usersActivityLogger
};
