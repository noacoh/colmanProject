const router = require('express-promise-router')();

const CoursesController = require('../controllers/courses');
router.route('/')
    .get(CoursesController.index)
    .post(CoursesController.newCourse);

router.route(':/courseId')
    .get(CoursesController.getCourse)
    .put(CoursesController.replaceCourse)
    .patch(CoursesController.updateCourse)
    .delete();

module.exports = router;

