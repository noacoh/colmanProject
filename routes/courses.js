const router = require('express-promise-router')();
const { validateParam, validateBody,  schemas } = require('../helpers/routeHelpers');

const CoursesController = require('../controllers/courses');
router.route('/')
    .get(CoursesController.index)
    .post(validateBody(schemas.courseSchema),
        CoursesController.newCourse);

router.route('/:courseId')
    .get(validateParam(schemas.idSchema, 'courseId'),
        CoursesController.getCourse)
    .put(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.courseSchema),
        CoursesController.replaceCourse)
    .patch(validateParam(schemas.idSchema, 'courseId'),
        validateBody(schemas.courseOptionalSchema),
        CoursesController.updateCourse);

module.exports = router;

