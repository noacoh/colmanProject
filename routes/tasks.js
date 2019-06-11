const router = require('express-promise-router')();
const path = require('path');
const TasksController = require('../controllers/tasks');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const multer  = require('multer');
const { resources } = require('../configuration');
const tasksStorage = multer.diskStorage({
    // configure destination folder for the files
    destination: function (req, file, cb) {
        cb(null, resources.tasks)
    },
    // we want to rename the file, in order to ensure files name is unique
    filename: function (req, file, cb) {
        const [name, extension] =file.originalname.split('.');
        cb(null, `${name}_${Date.now()}.${extension}`)
    }
});

const submissionStorage = multer.diskStorage({
    // configure destination folder for the files
    destination: function (req, file, cb) {
        cb(null, resources.submissions)
    },
    // we want to rename the file, in order to ensure files name is unique
    filename: function (req, file, cb) {
        const [name, extension] =file.originalname.split('.');
        cb(null, `${name}_${Date.now()}.${extension}`)
    }
});

// create file uploader for task exercise files
const taskUpload = multer({storage: tasksStorage});
// create file uploader for student submission files
const submissionUpload = multer({storage: submissionStorage});
const { SOLUTION_FILES, EXERCISE_FILES} = require('../configuration/supports').DATA_FORM.FIELD_NAME;
const { MAX_UPLOADS } = require('../configuration/supports');


router.route('/')
    .get(passportJWT,
        TasksController.index);

router.route('uploads')
    .post(taskUpload.array(EXERCISE_FILES, MAX_UPLOADS),
        validateBody(schemas.taskSchema),
        passportJWT,
        TasksController.uploadTask);

router.route('uploads/:taskId/solution')
    .post(taskUpload.array(EXERCISE_FILES, MAX_UPLOADS),
        validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.uploadSolution);

router.route('downloads/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.downloadExerciseFiles)
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        TasksController.getTaskSolutionFile);

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
