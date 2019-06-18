const Course = require('../models/course');
const Student = require('../models/student');
const {logger} = require('../configuration/winston');
const {removeFromArray} = require('../helpers/util');
const csv = require('csvtojson');


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
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        const { courseId } = req.value.params;
        const course = await Course.findById(courseId);
        res.status(200).json(course);
    },
    getCourseTasks: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
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
        const { courseId } = req.value.params;
        const newCourse = new Course(req.value.body);
        const course = await Course.findById(courseId, newCourse).populate('tasks');
        res.status(200).json(course.tasks);
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
    getStudentsEnlisted: async (req, res, next) => {
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
        res.status(200).json({ "students": course.enlisted });
    },
    enlistStudentToCourse: async (req, res, next) => {
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
        course.enlisted.push(user);
        course.save();
        res.status(200).json({
            success: true,
            message: `Enlisted ${student.firstName} ${student.lastName} to '${course.title}' course successfully`
        })
    },
        enlistStudentsToCourse: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.admin) {
            res.status(401).json({
                success: false,
                message: 'Unauthorised'
            })
        }
        const { courseId } = req.value.params;
        const studentsIdsJson  = await csv( {noheader:true, headers: ['identityNumber']}).fromFile(req.file.path);
        const studentsIds = studentsIdsJson.map(x=>x["identityNumber"]);
        const updated = [];
        const errors = [];
        const course = await Course.findById(courseId);
        for (let i = 0; i < studentsIds.length; i++) {
            const studentId = studentsIds[i];
            // Get Student
            let student;
            try {
                student = await Student.findById(studentId);
            } catch (err) {
                logger.info(`failed to add ${studentId} to course ${course.title}`, err);
                errors.push({id: studentId, err: 'student not found'});
                continue;
            }
            if (student.courses.includes(courseId)){
                logger.info(`'student ${studentId} already enlisted to course ${course.title}`);
                errors.push({id: studentId, err: 'student already enlisted to course'});
                continue;
            }
            student.courses.push(course);
            try {
                await student.save();
                course.enlisted.push(student);
            } catch (err) {
                logger.info(`failed to add ${studentId} to course ${course.title}`, err);
                errors.push({id: studentId, err: 'failed to update student courses'});
                continue;
            }
            updated.push(student);
        }
        try {
            await course.save();
        } catch (err) {
            logger.info(`failed to update course ${course.title}`, err);
            for (let i = 0; i < updated.length; i++) {
                const s = updated[i];
                removeFromArray(s.courses, course._id);
                await s.save();
            }
            res.status(400).json({
                success: false,
                message: 'Failed to update course',
            })
        }
        res.status(200).json({
            success: true,
            message: `Enlisted ${student.firstName} ${student.lastName} to '${course.title}' course successfully`,
            errors
        })
    },

    deleteCourse: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const { courseId } = req.value.params;
        await Course.findByIdAndRemove(courseId);
        res.status(200).json({
            success: true,
            message: 'Course was removed successfully'
        });
    },
};
