const router = require('express-promise-router')();
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');
const passport = require('passport');
const passportConf = require('../passport');
const passportJWT = passport.authenticate('jwt', {session: false});
const CoursesController = require('../controllers/courses');

router.route('/')
    .get(CoursesController.index)
    .post(validateBody(schemas.courseSchema),
        passportJWT,
        CoursesController.newCourse);

router.route('/:courseId')
    .get(validateParam(schemas.idSchema, 'courseId'),
        CoursesController.getCourse)
    .put(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.courseSchema),
        passportJWT,
        CoursesController.replaceCourse)
    .patch(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.courseOptionalSchema),
        passportJWT,
        CoursesController.updateCourse);

router.route('/:courseId/students')
    .get(validateParam(schemas.idSchema, 'courseId'),
        passportJWT,
        CoursesController.getStudentsEnrolled)
    .post(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.enrollToCourseSchema),
        passportJWT,
        CoursesController.enrollStudentToCourse);

router.route('/:courseId/removeStudents')
    .post(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.removeFromCourseSchema),
        passportJWT,
        CoursesController.removeStudentFromCourse);


module.exports = router;

