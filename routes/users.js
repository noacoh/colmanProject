const router = require('express-promise-router')();
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');

const UserController = require('../controllers/users');
router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema), UserController.newUser);

router.route(':/userId')
    .get(validateParam(schemas.idSchema, 'userId'), UserController.getUser)
    .put(UserController.replaceUser)
    .patch(UserController.updateUser);

router.route(':/userId/courses')
    .get(UserController.getUserCourses)
    .post(UserController.enlistUserToCourse);
module.exports = router;

