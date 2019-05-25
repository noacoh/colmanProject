const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    id: Number,
    title: String,
    filePath: String,
    solutionPath: String,
    created: Date,
    deadline: Date,
    course: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }],
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'submission'
    }]

});
const Task = mongoose.model('task', taskSchema);
module.exports = Task;