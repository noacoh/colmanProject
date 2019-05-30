const passport = require('passport');
const passportConf = require('../passport');
const TasksController = require('../controllers/tasks');
const router = require('express-promise-router')();
const multer  = require('multer');
const upload = multer({ dest: 'submissions/' });
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');
const passportJWT = passport.authenticate('jwt', {session: false});
const { MAX_UPLOADS } = require('../configuration/supports');


router.route('/')
    .get(passportJWT,
        TasksController.index);

router.route('uploads')
    .post(upload.fields([{ name: 'exFile', maxCount:1 }, { name: 'practiceTest', maxCount:MAX_UPLOADS }, { name: 'finalTest', maxCount:MAX_UPLOADS }]),
        validateBody(schemas.taskSchema),
        passportJWT,
        TasksController.uploadTask);

router.route('downloads/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTaskExerciseFile());

router.route('/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTask)
    .put(validateParam(schemas.idSchema, 'taskId'),
        validateBody(schemas.taskSchema),
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
        TasksController.getTaskSubmissions)
    .post(upload.array('solFile', MAX_UPLOADS),
        validateParam(schemas.idSchema, 'taskId'),
        validateBody(schemas.submitForGradeSchema),
        passportJWT,
        TasksController.submitForGrade);

module.exports = router;

// e.g multipart form to submit a file
// <form action="/profile" method="post" enctype="multipart/form-data">
//   <input type="file" name="solFile" />
// </form>
