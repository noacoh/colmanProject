const CoursesController = require('../controllers/courses');
const router = require('express-promise-router')();

router.route('/')
    .get(CoursesController.index)
    .post(CoursesController.newCourse);

router.route('/:courseId')
    .get(CoursesController.getCourse)
    .put(CoursesController.replaceCourse)
<<<<<<< HEAD
    .patch(CoursesController.updateCourse);
module.exports = router;
=======
    .patch(CoursesController.updateCourse)

module.exports = router;

>>>>>>> c483af13be8c9dfa557a6a4419ee4bfd11b1cff4
