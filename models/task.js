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
    exam: {
        type: Boolean,
        required: true,
        default: false
    },
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
taskSchema.methods.isExam = () => {return this.exam;};

module.exports = Task;
