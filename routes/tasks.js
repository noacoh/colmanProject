const router = require('express-promise-router')();
const TasksController = require('../controllers/tasks');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const multer  = require('multer');
const { RESOURCES } = require('../configuration');

// create file uploader for task exercise files
const taskUpload = multer({
    // configure destination folder for the files
    destination: RESOURCES.TASKS,
    // we want to rename the file, in order to ensure files name is unique
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
});
// create file uploader for student submission files
const submissionUpload = multer({
    // configure destination folder for the files
    destination: RESOURCES.SUBMISSIONS,
    // we want to rename the file, in order to ensure files name is unique
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
});
const { SOLUTION_FILES, EXERCISE_FILES} = require('../configuration/supports').DATA_FORM.FIELD_NAME;
const { MAX_UPLOADS } = require('../configuration/supports');


router.route('/')
    .get(passportJWT,
        TasksController.index);

router.route('uploads')
    .post(taskUpload.upload.array(EXERCISE_FILES, MAX_UPLOADS),
        validateBody(schemas.taskSchema),
        passportJWT,
        TasksController.uploadTask);

router.route('uploads/:taskId/solution')
    .post(taskUpload.upload.array(EXERCISE_FILES, MAX_UPLOADS),
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.uploadSolution);

router.route('downloads/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.downloadExerciseFiles())
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTaskSolutionFile());

router.route('/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTaskData)
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
