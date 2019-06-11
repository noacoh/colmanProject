const winston = require('winston');
const { format } = winston;
const { combine, timestamp, printf} = format;

const activityLogFormat = printf(({ level, message, timestamp, id }) => {
    return `${timestamp} ${level} ${id}: ${message}`;
});

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level} : ${message}`;
});

const { resources } = require('./index');
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

winston.loggers.add('winston', {
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.File(options.file.app),
        new winston.transports.Console(options.console)
    ],
    // exitOnError: false, // do not exit on handled exceptions
});
winston.loggers.add('usersactivity', {
    format: combine(
        timestamp(),
        activityLogFormat
        ),
    transports: [
        new winston.transports.File(options.file.usersActivity),
        new winston.transports.Console(options.console)
    ],
    // exitOnError: false, // do not exit on handled exceptions
});

const logger = winston.loggers.get('winston');
const usersActivityLogger = winston.loggers.get('winston');

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
