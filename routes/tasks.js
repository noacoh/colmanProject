
const TasksController = require('../controllers/tasks');
const router = require('express-promise-router')();
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
    .get(TasksController.index)
    .post(validateParam(schemas.taskSchema),
         TasksController.newTask);

router.route('/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        TasksController.getTask)
    .put([validateParam(schemas.idSchema, 'taskId'),
        validateBody(schemas.taskSchema)],
        TasksController.replaceTask)
    .patch([validateParam(schemas.idSchema, 'taskId'),
        validateParam(schemas.taskOptionalSchema)],
        TasksController.updateTask)
    .delete(validateParam(schemas.idSchema, 'taskId'),
        TasksController.deleteTask);

router.route('/:taskId/submissions')
    .get(validateParam(schemas.idSchema, 'taskId'),
        TasksController.getTaskSubmission);

module.exports = router;