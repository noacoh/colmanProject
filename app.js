const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect("mongodb://localhost:27017/submission_system",  { useNewUrlParser: true });

const app = express();

// Routes
const courses = require('./routes/courses');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const submissions = require('./routes/submissions');

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());

// Routes
app.use('/courses', courses);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/submissions', submissions);


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

