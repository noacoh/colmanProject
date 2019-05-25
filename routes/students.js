const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport')
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');

const StudentController = require('../controllers/students');
const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/')
    .get(StudentController.index);

router.route('/:studentId')
    .get(validateParam(schemas.idSchema, 'studentId'),
        StudentController.getStudent);

router.route(':/studentId/courses')
    .get(validateParam(schemas.idSchema, 'studentId'),
        StudentController.getStudentCourses);

router.route('/:studentId/courses/:courseId')
    .post(validateParam(schemas.idSchema, 'studentId'),
        validateParam(schemas.idSchema, 'courseId'),
        passportJWT,
        StudentController.enlistStudentToCourse);
module.exports = router;

