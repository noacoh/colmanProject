
const TasksController = require('../controllers/tasks');
const router = require('express-promise-router')();

router.route('/')
    .get(TasksController.index)
    .post(TasksController.newTask);


module.exports = router;