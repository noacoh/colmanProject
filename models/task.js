const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    id: Number,
    courseId: Number,
    title: String,
    filePath: String,
    solutionPath: String,
    created: Date,
    deadline: Date
});
const Task = mongoose.model('task', taskSchema);
module.exports = Task;