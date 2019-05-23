const CoursesController = require('../controllers/courses');
const router = require('express-promise-router')();

router.route('/')
    .get(CoursesController.index)
    .post(CoursesController.newCourse);

router.route('/:courseId')
    .get(CoursesController.getCourse)
    .put(CoursesController.replaceCourse)
    .patch(CoursesController.updateCourse);
module.exports = router;