const router = require('express-promise-router')();
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', {session: false});
const CoursesController = require('../controllers/courses');
const { STUDENTS_LIST } = require('../configuration/supports').DATA_FORM.FIELD_NAME;


const multer  = require('multer');
const { resources } = require('../configuration');
const studentsListStorage = multer.diskStorage({
    // configure destination folder for the files
    destination: function (req, file, cb) {
        cb(null, resources.students_list)
    },
    // we want to rename the file, in order to ensure files name is unique
    filename: function (req, file, cb) {
        const [name, extension] = file.originalname.split('.');
        cb(null, `${name}_${Date.now()}.${extension}`)
    }
});
const upload = multer({storage: studentsListStorage});

router.route('/')
    .get(CoursesController.index)
    .post(validateBody(schemas.courseSchema),
        passportJWT,
        CoursesController.newCourse);

router.route('/:courseId')
    .get(validateParam(schemas.idSchema, 'courseId'),
        passportJWT,
        CoursesController.getCourse)
    .put(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.courseSchema),
        passportJWT,
        CoursesController.replaceCourse)
    .patch(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.courseOptionalSchema),
        passportJWT,
        CoursesController.updateCourse)
    .delete(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.courseOptionalSchema),
        passportJWT,
        CoursesController.deleteCourse);

router.route('/:courseId/students')
    .get(validateParam(schemas.idSchema, 'courseId'),
        passportJWT,
        CoursesController.getStudentsEnlisted)
    .post(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.enlistToCourseSchema),
        passportJWT,
        CoursesController.enlistStudentToCourse);

router.route('/:courseId/uploads/students')
    .post(upload.single(STUDENTS_LIST),
        validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.enlistToCourseSchema),
        passportJWT,
        CoursesController.enlistStudentsToCourse);

router.route('/:courseId/tasks')
    .get(validateParam(schemas.idSchema, 'courseId'),
        passportJWT,
        CoursesController.getCourseTasks);


module.exports = router;

