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
            exercisePath:req.files['exFile'].map( file => file.path),
            practiceTest: req.files['practiceTestFile'].map( file => file.path),
            finalTest: req.files['finalTestFile'].map( file => file.path),
            created: new Date(),
            deadline: deadline,
            course: courseId
        };
        await newTask.save();
      },
    uploadTaskSolution: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const { taskId } = req.value.params;
        const { solutionPath } = req.value.params;
        await Task.findByIdAndUpdate(taskId, solutionPath);
        res.status(200).json({
            success: true,
            message: 'Task solution was updated successfully'
        });
      },
    getTask: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
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
                    message: "Unauthorized"
                })
            }
        }
        if (task.solutionPath === null){
            res.status(404).json({
                    success: false,
                    message: "Solution file isn't found"
                })
        } else{
            if (task.deadline < new Date()){
                res.sendFile(task.solutionPath);
            }
            else{
                res.status(404).json({
                    success: false,
                    message: "Can't download solution..."
                })
            }
        }
    },
    getTaskLateSubmissionList: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: "Unauthorised"
            })
        }
        const {taskId} = req.value.params;
        const task = await Task.findById(taskId).populate('studentSubmissions');
        const lateStudents = [];
        task.studentSubmissions.forEach(studentSubmission => {
           if (studentSubmission.submissionDate > task.deadline) {
               lateStudents.push(studentSubmission.student.identityNumber);
           }
        });
        // TODO consider returning only grades and student ids/identity numbers
        res.status(200).json(lateStudents);
    }
};
