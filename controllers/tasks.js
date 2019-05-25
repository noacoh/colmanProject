const Task = require('../models/task');

module.exports = {
    index: async (req, res, next) => {
        const tasks = await Task.find({});
        res.status(200).json(tasks);
  },
    newTask: async (req, res, next) => {
      const newTask = new Task(req.value.body);
      const task = await newTask.save();
      res.status(201).json(task);
      },
    getTask: async (req, res, next) => {
        const { taskId } = req.value.params;
        const task = await Task.findById(taskId);
        res.status(200).json(task);
    },
    replaceTask: async (req, res, next) => {
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
        const { taskId } = req.value.params;
        await Task.findByIdAndRemove(taskId);
        res.status(200).json({
            success: true,
            message: 'Task was removed successfully'
        })
    },
    getTaskSubmission: async (req, res, next) => {
        const { taskId } = req.value.params;
        const task = await Task.findById(taskId).populate('submissions');
        res.status(200).json(task.studentSubmissions);
    }

};