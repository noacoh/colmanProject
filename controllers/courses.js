const Course = require('../models/course');

module.exports = {
    index: async (req, res, next) => {
        const courses = await Course.find({});
        res.status(200).json(courses);
    },
    newCourse: async (req, res, next) => {
        const newCourse = new Course(req.body);
        const course = await newCourse.save();
        res.status(201).json(course);
    },
    getCourse: async (req, res, next) => {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        res.status(200).json(course);
    },
    replaceCourse: async (req, res, next) => {
        // enforce request.body contains all the fields
        const { courseId } = req.params;
        const newCourse = new Course(req.body);
        const result = await Course.findByIdAndUpdate(courseId, newCourse);
        res.status(200).json({
            success: true,
            message: 'Course replaced successfully'
        });
    },
    updateCourse: async (req, res, next) => {
        // req.body may contain any number of fields
        const { courseId } = req.params;
        const newCourse = new Course(req.body);
        const result = await Course.findByIdAndUpdate(courseId, newCourse);
        res.status(200).json({
            success: true,
            message: 'Course updated successfully'
        });
    },
};
