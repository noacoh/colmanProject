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

router.route('/:courseId/tasks')
    .get(validateParam(schemas.idSchema, 'courseId'),
        passportJWT,
        CoursesController.getCourseTasks);


module.exports = router;

