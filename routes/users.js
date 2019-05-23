const router = require('express-promise-router')();
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');

const UserController = require('../controllers/users');
router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema),
        UserController.newUser);

router.route(':/userId')
    .get(validateParam(schemas.idSchema, 'userId'), UserController.getUser)
    .put(validateParam(schemas.idSchema, 'userId'),
        validateBody(schemas.userSchema),
        UserController.replaceUser)
    .patch(validateParam(schemas.idSchema, 'userId'),
        validateBody(schemas.userOptionalSchema),
        UserController.updateUser);

router.route(':/userId/courses')
    .get(validateParam(schemas.idSchema, 'userId'),
        UserController.getUserCourses)
    .post(validateParam(schemas.idSchema, 'userId'),
        UserController.enlistUserToCourse);
module.exports = router;

