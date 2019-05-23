const router = require('express-promise-router')();

const UserController = require('../controllers/users');
router.route('/')
    .get(UserController.index)
    .post(UserController.newUser);

router.route(':/userId')
    .get(UserController.getUser)
    .put(UserController.replaceUser)
    .patch(UserController.updateUser)

router.route(':/userId/courses')
    .get(UserController.getUserCourses)
    .post(UserController.enlistUserToCourse)
module.exports = router;

