const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    id: Number,
    title: String,
    // path to zip containing all exercise files
    exerciseZip: String,
    // files containing the code for the practice test
    practiceTest: {
        dir: String,
        files: [String]
    },
    // files containing the code for the final test
    finalTest: {
        dir: String,
        files: [String]
    },
    // files containing the code for the final test
    solution: {
        dir: String,
        files: [String]
    },
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
