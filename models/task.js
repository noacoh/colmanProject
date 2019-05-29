const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    id: Number,
    title: String,
    exercisePath: String,
    practiceTestPath: String,
    finalTestPath: String,
    created: Date,
    deadline: Date,
    course: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }],
    studentSubmissions: [{
        type: Schema.Types.ObjectId,
        ref: 'submission'
    }]

});
const Task = mongoose.model('task', taskSchema);

module.exports = Task;
