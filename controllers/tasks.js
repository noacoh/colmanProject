const Task = require('../models/task');

module.exports = {
  index: async (req, res, next) => {
    try{
        const tasks = await Task.find({});
        res.status(200).json(tasks);
    } catch(err){
          next(err);}
  },
    newTask: async (req, res, next) => {
      try{
      const newTask = new Task(req.body);
      console.log('new task', newTask);
      const task = await newTask.save();
      res.status(201).json(task);
      }catch(err){
          next(err);
      }
    }
};