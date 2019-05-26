const passport = require('passport');
const passportConf = require('../passport');
const TasksController = require('../controllers/tasks');
const router = require('express-promise-router')();
const { validateParam,
        validateBody,
        schemas
} = require('../helpers/routeHelpers');
const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/')
    .get(passportJWT,
        TasksController.index,)
    .post(validateParam(schemas.taskSchema),
         passportJWT,
         TasksController.newTask);

router.route('/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTask)
    .put([validateParam(schemas.idSchema, 'taskId'),
        validateBody(schemas.taskSchema)],
        passportJWT,
        TasksController.replaceTask)
    .patch([validateParam(schemas.idSchema, 'taskId'),
        validateParam(schemas.taskOptionalSchema)],
        passportJWT,
        TasksController.updateTask)
    .delete(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.deleteTask);

router.route('/:taskId/submissions')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTaskSubmission);

module.exports = router;