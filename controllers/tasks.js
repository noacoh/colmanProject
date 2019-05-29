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
                message: "Unauthorized"
            })
        }
        const { title, deadline, courseId } = req.value.body;
        const newTask = {
            title: title,
            exercisePath:req.files['exFile'][0],
            practiceTestPath: req.files['practiceTestFile'][0],
            finalTestPath: req.files['finalTestFile'][0],
            created: new Date(),
            deadline: deadline,
            course: courseId
        };
        await newTask.save();
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
            filePath: req.file.path,
            mode: mode
        });
        await newSubmission.save(); // grade is calculated here
        res.status(201).json({
            success: true,
            message: 'File was submitted successfully',
            data: { grade: newSubmission.grade }
        });
    },
    getTaskExerciseFile: async (req, res, next) => {
        const resourceRequester = req.user;
        const { taskId } = req.value.params;
        // TODO consider try catch block here
        const task = await Task.findById(taskId).populate('course'); // validate task exists
        const course = task.course;
        if (!resourceRequester.isAdmin()){
            if(!course.studentIsRegisteredForCourse(resourceRequester._id)){
                // student is not registered for this course
                console.log(`student ${resourceRequester.FullName()} is not registered for course ${course.title}. Can not supply exercise file fo this task.`);
                res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                })
            }
        }
        res.sendFile(task.exercisePath)
    }
};
