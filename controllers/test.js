const { Test } = require('../models/test');
const Task = require('./task');
module.exports = {
    index: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const tests = await Test.find({});
        res.status(200).json(tests);
    },
    addTest: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { units, taskId, mode } = req.value.body;
        const task = await Task.findById(taskId);
        const newTest = new Test({
            units,
            task: taskId,
        });
        const test = await newTest.save();
        // update the task document
        const tests = task.test;
        tests[mode] = test._id;
        await task.update({test: tests});
        await task.save();

        res.status(203).json({
            success: true,
            message: "New test was created successfully"
        });
    },
};
