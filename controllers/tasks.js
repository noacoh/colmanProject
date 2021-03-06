const zip = require('express-zip');
const Course = require('../models/course');
const Student = require('../models/student');
const Task = require('../models/task');
const { Submission, MODE} = require('../models/submission');
const {logger, usersActivityLogger} = require('../configuration/winston');
const { moveFiles, createDirectoryIfNotExists } = require("../helpers/util");
const { resources } = require('../configuration');

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
        const files = req.files.map( file => {
            return {
                path: file.path,
                name: file.filename,
                size: file.size
            }
        });
        const course = await Course.findById(courseId);
        const newTask = {
            title: title,
            exercise: { files: files },
            meta : { created: new Date() },
            deadline: deadline,
            course: courseId
        };
        await newTask.save();
        course.tasks.push(newTask._id);
        await course.save();

        res.status(201).json({
            success: true,
            message: "Task was created successfully"
        })
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
        const task = await Task.findById(taskId); // validate task exists
        const course = await Course.findById(task.course);

        usersActivityLogger.info({id: resourceRequester.identityNumber, message: "attempted submission", mode: mode, task: task.title});
        // validate student is registered for course
        if (!resourceRequester.isAdmin()){
            if(!course.studentIsRegisteredForCourse(resourceRequester._id)){
                // student is not registered for this course
                logger.debug(`student ${resourceRequester.firstName} ${resourceRequester.lastName}  is not registered for course ${course.title}. Can not preform task submission.`);
                usersActivityLogger.info({id:resourceRequester.identityNumber, message: "student is not registered for course. aborting."});
                res.status(401).json({
                    success: false,
                    message: "Unauthorized to access resource."
                })
            }
        }

        // check if task deadline was passed
        const now = new Date();
        // do not allow to submit if deadline was passed
        if ( now  > task.deadline ) {
            logger.debug(`student ${resourceRequester.identityNumber} is trying to submit past deadline. aborting`);
            res.status(400).json({
                success: false,
                message: "Deadline was passed"
            });
        }

        if (task.studentSubmittedForTask(resourceRequester._id)) {
            // during exam, final submission can be preformed only once
            if (task.isExam() && mode === MODE.FINAL) {
                logger.debug(`student ${resourceRequester.identityNumber} is trying to submit past deadline. aborting`);
                res.status(400).json({
                    success: false,
                    message: 'Final submission during exam can be preformed only once.'
                });
            }
            logger.debug("removing prior submission");
            // remove prior submission before creating a new submission document for the student
            await Submission.remove({ student: resourceRequester._id, task: task._id});
        }

        const newDir = `${resources.submissions.root}/${taskId}_${resourceRequester.identityNumber}`
        // arrange submission files in separated directory
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            await createDirectoryIfNotExists(newDir);
            await moveFiles(file.path, `${newDir}/${file.originalname}`);
        }

        // create new submission document
        const newSubmission = new Submission({
            submissionDate: new Date(),
            task: taskId,
            student: resourceRequester._id,
            files: req.files.map(file => {
                return {
                    path: `${newDir}/${file.originalname}`,
                    name: file.originalname,
                    size: file.size
                }
            }),
            mode: mode
        });

        const submission = await newSubmission.save(); // grade is calculated here
        const out = await submission.submit();
        res.status(201).json(out);
    },
    downloadExerciseFiles: async (req, res, next) => {
        const resourceRequester = req.user;
        const { taskId } = req.value.params;
        const task = await Task.findById(taskId);
        const course = await Course.findById(task.course);
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
            if(!course.studentIsRegisteredForCourse(resourceRequester._id)){
                // student is not registered for this course
                logger.info(`student ${resourceRequester.firstName} ${resourceRequester.lastName} is not registered for course ${course.title}. Can not supply exercise file fo this task.`);
                res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                })
            }
        }
        const files = task.exercise.files.map(file => {
            return {
                path: file.path,
                name: file.name
            }
        });
        usersActivityLogger.info({id: resourceRequester.identityNumber, message: `task ${task.title} files downloaded`, course: course, task: task.title});
        // send response with zip file containing all solution files
        res.zip(files);
    },

    getTaskSolutionFile: async (req, res, next) => {
        const resourceRequester = req.user;
        const { taskId } = req.value.params;
        const task = await Task.findById(taskId);
        const course = await Course.findById(task.course);
        if (!resourceRequester.isAdmin()){
            if(!course.studentIsRegisteredForCourse(resourceRequester._id)){
                // student is not registered for this course
                console.log(`student ${resourceRequester.firstName} ${resourceRequester.lastName} is not registered for course ${course.title}. Can not supply exercise file fo this task.`);
                res.status(401).json({
                    success: false,
                    message: "Unauthorized to access resource."
                })
            }
        }
        if (task.solution === null){
            res.status(404).json({
                    success: false,
                    message: "Solution file not found"
                })
        } else {
            if (task.deadline < new Date() || resourceRequester.isAdmin()){
                const files = task.solution.files.map(file => {
                    return {
                        path: file.path,
                        name: file.name
                    }
                });
                // send response with zip file containing all solution files
                res.zip(files);
            }
            else{
                res.status(404).json({
                    success: false,
                    message: "Unauthorized to access resource. You are trying to access solution before deadline date has passed."
                })
            }
        }
    },
    uploadSolution: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const { taskId } = req.value.params;
        const files = req.files.map( file => {
            return {
                path: file.path,
                name: file.filename,
                size: file.size
            }
        });
        await Task.findByIdAndUpdate(taskId, {solution: {files: files}});
        res.status(200).json({
            success: true,
            message: "Uploaded solution files successfully"
        });
    }
};
