const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { server } = require('configuration');
const { logger } = require('./configuration/logger');

const LOG_HTTP_TRAFFIC = server.logs.http;

mongoose.connect("mongodb://localhost:27017/submission_system",
    { useCreateIndex: true,
      useNewUrlParser: true });

const app = express();

// Routes
const courses = require('./routes/courses');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const submissions = require('./routes/submissions');
const testUnit = require('./routes/testUnit');
const test = require('./routes/test');

// Middlewares
app.use(helmet());
app.use(bodyParser.json());
if (LOG_HTTP_TRAFFIC) {
    app.use(morgan('combined', { stream: logger.stream }));
}

// Routes
app.use('/courses', courses);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/submissions', submissions);
app.use('/testUnit', testUnit);
app.use('/test', test);


// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler function
app.use((err, req, res, next) => {

    //include winston logging
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // Respond to client
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        error : {
            message: error.message
        }
    });
});

// Start the server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

