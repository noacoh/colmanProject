const Task = require('../models/task');
const Submission = require('../models/submission');
const Student = require('../models/student');

module.exports = {
    index: async (req, res, next) => {
        const tasks = await Task.find({});
        res.status(200).json(tasks);
        },
    uploadTask: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        // TODO save files and create a new task
      },
    getTask: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        const { taskId } = req.value.params;
        const task = await Task.findById(taskId);
        res.status(200).json(task);
    },
    replaceTask: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        //need a complete object with all params
        const { taskId } = req.value.params;
        const newTask = req.value.body;
        await Task.findByIdAndUpdate(taskId, newTask);
        res.status(200).json({
            success: true,
            message: 'Task was replaced successfully'
        });
    },
    updateTask: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        //can update specific fields
        const { taskId } = req.value.params;
        const newTask = req.value.body;
        await Task.findByIdAndUpdate(taskId, newTask);
        res.status(200).json({
            success: true,
            message: 'Task was updated successfully'
        });
    },
    deleteTask: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
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
        const task = await Task.findById(taskId).populate('submissions');
        // TODO consider returning only grades and student ids/identity numbers
        res.status(200).json(task.studentSubmissions);
    },
    submitForGrade: async (req, res, next) => {
        const resourceRequester = req.user;
        const { taskId } = req.value.params;
        // TODO do we really need to pass studentid? we have the id from the authentication
        const { studentId } = req.value.body;
        if (resourceRequester !== studentId) {
            // confirm the resourceRequester is identical to the student. also confirms studentId.
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        // TODO consider try catch block here
        await Task.findById(taskId); // validate task exists
        const newSubmission = new Submission({
            submissionDate: new Date(),
            task: taskId,
            student: studentId,
            filePath: req.file.path
        });
        await newSubmission.save(); // grade is calculated here
        res.status(200).json({
            success: true,
            message: 'File was submitted successfully'
        });
    },
    getTaskExerciseFile: async (req, res, next) => {
        const resourceRequester = req.user;
        const { taskId } = req.value.params;
        // TODO consider try catch block here
        const task = await Task.findById(taskId).populate('course'); // validate task exists
        const course = task.course;
        if (resourceRequester.isAdmin()){
            if(!course.studentIsRegisteredForCourse(resourceRequester._id)){
                // student is not registered for this course
                console.log(`student ${student.FullName()} is not registered for course ${course.title}. Can not supply exercise file fo this task.`);
                res.status(401).json({
                    success: false,
                    message: "Unauthorised"
                })
            }
        }
        // TODO send file to client here
    }
};
