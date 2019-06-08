const passport = require('passport');
const passportConf = require('../passport');
const TasksController = require('../controllers/tasks');
const router = require('express-promise-router')();
//const { taskUploader, submissionUploader } = require('../helpers/customStorage');
const multer  = require('multer');
const {RESOURCES} = require('../configuration');
const taskUpload = multer({destination:RESOURCES.TASKS});
const submissionUpload = multer({destination: RESOURCES.SUBMISSIONS});
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');
const passportJWT = passport.authenticate('jwt', {session: false});
const { MAX_UPLOADS } = require('../configuration/supports');
const { SOLUTION_FILES, FINAL_TEST_FILES, PRACTICE_TEST_FILES, EXERCISE_FILE} = require('../configuration/supports').DATA_FORM.FIELD_NAME;


router.route('/')
    .get(passportJWT,
        TasksController.index);

router.route('uploads')
    .post(taskUpload.upload.fields([{ name: EXERCISE_FILE, maxCount: 1 }, { name: PRACTICE_TEST_FILES, maxCount: MAX_UPLOADS }, { name: FINAL_TEST_FILES, maxCount: MAX_UPLOADS }, { name: SOLUTION_FILES, maxCount: MAX_UPLOADS }]),
        validateBody(schemas.taskSchema),
        passportJWT,
        TasksController.uploadTask);

router.route('downloads/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTaskExerciseFile())
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTaskSolutionFile());

router.route('/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTask)
    .delete(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.deleteTask);

router.route('/:taskId/submissions')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTaskSubmissions)
    .post(submissionUpload.array( SOLUTION_FILES, MAX_UPLOADS ),
        validateParam(schemas.idSchema, 'taskId'),
        validateBody(schemas.submitForGradeSchema),
        passportJWT,
        TasksController.submitForGrade);

module.exports = router;

// e.g multipart form to submit a file
// <form action="/profile" method="post" enctype="multipart/form-data">
//   <input type="file" name="solFile" />
// </form>
