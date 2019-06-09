const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rfs = require('rotating-file-stream');
const { RESOURCES } = require('configuration');

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

// log all requests in the Apache combined format to one log file per day in the log/
// create a rotating write stream
const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(RESOURCES.LOGS.HTTP, 'log')
});

// Middlewares
app.use(helmet());
// setup the logger
app.use(logger('dev', { stream: accessLogStream }));
app.use(bodyParser.json());

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
   // Respond to client
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        error : {
            message: error.message
        }
    });

   // Respond to terminal
   console.error(err);
});

// Start the server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

