const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    id: Number,
    title: String,
    // path to zip containing all exercise files
    exercisePath: String,
    // files containing the code for the practice test,
    solutionPath: String,
    practiceTest: [{
        type: String
    }],
    // files containing the code for the final test
    finalTest: [{
    type: String
    }],
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
taskSchema.methods.isExam = () => {return this.exam;};

taskSchema.post('remove', async function(next) {
    try {
        // TODO delete files
        next();
    } catch(err) {
        next(err);
    }
});

const Task = mongoose.model('task', taskSchema);

module.exports = Task;
