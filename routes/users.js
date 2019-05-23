<<<<<<< HEAD
=======
const router = require('express-promise-router')();
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');

>>>>>>> c483af13be8c9dfa557a6a4419ee4bfd11b1cff4
const UserController = require('../controllers/users');
const router = require('express-promise-router')();
router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema),
        UserController.newUser);

router.route(':/userId')
<<<<<<< HEAD
    .get(UserController.getUser)
    .put(UserController.replaceUser)
    .patch(UserController.updateUser);
=======
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
>>>>>>> c483af13be8c9dfa557a6a4419ee4bfd11b1cff4

module.exports = router;