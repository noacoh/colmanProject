const Task = require('../models/task');
const Submission = require('../models/submission');
const zip = require('express-zip');

// TODO we need to change controller and router according to new schema

module.exports = {
    index: async (req, res, next) => {
        const tasks = await Task.find({});
        res.status(200).json(tasks);
        },
    uploadTask: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const { title, deadline, courseId } = req.value.body;
        const newTask = {
            title: title,
            exercise: { files: req.files },
            meta : { created: new Date() },
            deadline: deadline,
            course: courseId
        };
        await newTask.save();
      },
    getTaskData: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const { taskId } = req.value.params;
        const task = await Task.findById(taskId);
        res.status(200).json(task);
    },
    deleteTask: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const { taskId } = req.value.params;
        await Task.findByIdAndRemove(taskId);
        res.status(200).json({
            success: true,
            message: 'Task was removed successfully'
        });
    },
    getTaskSubmissions: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        const { taskId } = req.value.params;
        const task = await Task.findById(taskId).populate('studentSubmissions');
        // TODO consider returning only grades and student ids/identity numbers
        res.status(200).json(task.studentSubmissions);
    },
    submitForGrade: async (req, res, next) => {
        const resourceRequester = req.user;
        const { taskId } = req.value.params;
        const { mode } = req.value.body;
        // TODO consider try catch block here
        await Task.findById(taskId); // validate task exists
        const newSubmission = new Submission({
            submissionDate: new Date(),
            task: taskId,
            student: resourceRequester._id,
            files: req.files.map(file => file.path),
            mode: mode
        });
        await newSubmission.save(); // grade is calculated here
        res.status(201).json({
            success: true,
            message: 'Files submitted successfully',
            data: { grade: newSubmission.grade }
        });
    },
    downloadExerciseFiles: async (req, res, next) => {
        const resourceRequester = req.user;
        const { taskId } = req.value.params;
        // TODO consider try catch block here
        const task = await Task.findById(taskId).populate('course'); // validate task exists
        const course = task.course;
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
            if(!course.studentIsRegisteredForCourse(resourceRequester._id)){
                // student is not registered for this course
                console.log(`student ${resourceRequester.FullName()} is not registered for course ${course.title}. Can not supply exercise file fo this task.`);
                res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                })
            }
        }
        const files = exercise.files.map(path => {
            return {
                path: path,
                name: path.split("/").pop()
            }
        });
        res.zip(files)
    },

    getTaskSolutionFile: async (req, res, next) => {
        const resourceRequester = req.user;
        const { taskId } = req.value.params;
        const task = await Task.findById(taskId).populate('course'); // validate task exists
        const course = task.course;
        if (!resourceRequester.isAdmin()){
            if(!course.studentIsRegisteredForCourse(resourceRequester._id)){
                // student is not registered for this course
                console.log(`student ${resourceRequester.FullName()} is not registered for course ${course.title}. Can not supply exercise file fo this task.`);
                res.status(401).json({
                    success: false,
                    message: "Unauthorized to access resource."
                })
            }
        }
        if (task.solutionPath === null){
            res.status(404).json({
                    success: false,
                    message: "Solution file not found"
                })
        } else{
            if (task.deadline < new Date() || resourceRequester.isAdmin()){
                res.sendFile(task.solutionPath);
            }
            else{
                res.status(404).json({
                    success: false,
                    message: "Unauthorized to access resource. You are trying to access solution before deadline date has passed."
                })
            }
        }

    }
};
