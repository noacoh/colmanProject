const Course = require('../models/course');
const Student = require('../models/student');

module.exports = {
    index: async (req, res, next) => {
        const courses = await Course.find({});
        res.status(200).json(courses);
    },
    newCourse: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        const newCourse = new Course(req.value.body);
        const course = await newCourse.save();
        res.status(201).json(course);
    },
    getCourse: async (req, res, next) => {
        const { courseId } = req.value.params;
        const course = await Course.findById(courseId);
        res.status(200).json(course);
    },
    replaceCourse: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        // enforce request.body contains all the fields
        const { courseId } = req.value.params;
        const newCourse = new Course(req.value.body);
        await Course.findByIdAndUpdate(courseId, newCourse);
        res.status(200).json({
            success: true,
            message: 'Course replaced successfully'
        });
    },
    updateCourse: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        // req.body may contain any number of fields
        const { courseId } = req.value.params;
        const newCourse = new Course(req.value.body);
        await Course.findByIdAndUpdate(courseId, newCourse);
        res.status(200).json({
            success: true,
            message: 'Course updated successfully'
        });
    },
    getStudentsEnrolled: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        // req.body may contain any number of fields
        const { courseId } = req.value.params;
        const course = await Course.findById(courseId).populate('student');
        res.status(200).json({ "students": course.enrolled });
    },
    enrollStudentToCourse: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: 'Unauthorised'
            })
        }
        const { courseId } = req.value.params;
        const { studentId } = req.value.body;
        // Get Student
        const student = await Student.findById(studentId);
        // Get Course
        const course = await Course.findById(courseId);
        user.courses.push(course);
        await student.save();
        course.enrolled.push(user);
        course.save();
        res.status(200).json({
            success: true,
            message: `Enrolled ${student.firstName} ${student.lastName} to '${course.title}' course successfully`
        })
    },
    removeStudentFromCourse: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: 'Unauthorised'
            })
        }
        const { courseId } = req.value.params;
        const { studentId } = req.value.body;
        // Get Student
        const student = await Student.findById(studentId);
        // Get Course
        const course = await Course.findById(courseId);
        user.courses.remove(course);
        await student.save();
        course.enrolled.remove(user);
        course.save();
        res.status(200).json({
            success: true,
            message: `Removed ${student.firstName} ${student.lastName} from '${course.title}' course successfully`
        })
    }
};
