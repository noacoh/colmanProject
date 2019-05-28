const Student = require('../models/student');
const Course = require('../models/course');

module.exports = {
    index: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const students = await Student.find({});
        res.status(200).json(students);
    },
    getStudent: async (req, res, next) => {
        const resourceRequester = req.user;
        const { studentId } = req.value.params;
        if (resourceRequester.id !== studentId && !resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const student = await Student.findById(userId);
        res.status(200).json(student);
    },
    getStudentCourses: async (req, res, next) => {
        const resourceRequester = req.user;
        const { studentId } = req.value.params;
        if (resourceRequester.id !== studentId && !resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const student = await Student.findById(studentId).populate('courses');
        res.status(200).json(student.courses);
    }
};
