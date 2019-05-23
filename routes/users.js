const UserController = require('../controllers/users');
const router = require('express-promise-router')();
router.route('/')
    .get(UserController.index)
    .post(UserController.newUser);

router.route(':/userId')
    .get(UserController.getUser)
    .put(UserController.replaceUser)
    .patch(UserController.updateUser);

module.exports = router;