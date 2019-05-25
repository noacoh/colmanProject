const Student = require('../models/student');
const Course = require('../models/course');

module.exports = {
    index: async (req, res, next) => {
        const students = await Student.find({});
        res.status(200).json(students);
    },
    getStudent: async (req, res, next) => {
        const { userId } = req.value.params;
        const student = await Student.findById(userId);
        res.status(200).json(student);
    },
    getStudentCourses: async (req, res, next) => {
        const { studentId } = req.value.params;
        const student = await Student.findById(userId).populate('courses');
        res.status(200).json(student.courses);
    },
    enlistStudentToCourse: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin) {
            res.status(403).json({
                success: false,
                message: 'Unauthorised'
            })
        }
        const { studentId, courseId } = req.value.params;
        // Get Student
        const student = await Student.findById(studentId);
        // Get Course
        const course = await Course.findById(courseId);
        user.courses.push(course);
        await student.save();
        course.enlisted.push(user);
        course.save();
        res.status(200).json({
            success: true,
            message: `Enlisted ${student.firstName} ${student.lastName} to '${course.title}' course successfully`
        })
    },
};
