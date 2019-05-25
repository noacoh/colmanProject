const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport')
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');

const UserController = require('../controllers/users');
router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema),
        UserController.newUser);

// router.route('/signup')
//     .post(UserController.signUp);

router.route('/signin')
    .post(UserController.signIn);

router.route('/secret')
    .get(passport.authenticate('jwt', {session: false}), UserController.secret);

router.route('/:userId')
    .get(validateParam(schemas.idSchema, 'userId'), UserController.getUser)
    .put(validateParam(schemas.idSchema, 'userId'),
        validateBody(schemas.userSchema),
        UserController.replaceUser)
    .patch(validateParam(schemas.idSchema, 'userId'),
        validateBody(schemas.userOptionalSchema),
        UserController.updateUser);

router.route(':/userId/courses')
    .get(validateParam(schemas.idSchema, 'userId'),
        UserController.getUserCourses);

router.route('/:userId/courses/:courseId')
    .post(validateParam(schemas.idSchema, 'userId'),
        validateParam(schemas.idSchema, 'courseId'),
        UserController.enlistUserToCourse);
module.exports = router;

