const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport')
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');

const passportJWT = passport.authenticate('jwt', {session: false});
const StudentController = require('../controllers/students');

router.route('/')
    .get(StudentController.index);

router.route('/:studentId')
    .get(validateParam(schemas.idSchema, 'studentId'),
        passportJWT,
        StudentController.getStudent);

router.route(':/studentId/courses')
    .get(validateParam(schemas.idSchema, 'studentId'),
        passportJWT,
        StudentController.getStudentCourses);

module.exports = router;

