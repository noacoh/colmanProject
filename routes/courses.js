const express = require('express');
// const router = express.Router();
const router = require('express-promise-router')();

const CoursesController = require('../controllers/courses');
router.route('/')
    .get(CoursesController.index)
    .post(CoursesController.newCourse);

module.exports = router;

