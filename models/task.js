const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TYPE = {
    EXAM: "exam",
    EXERCISE: "exercise"
};

const taskSchema = new Schema({
    title: String,
    // path to zip containing all exercise files
    exercise: {
        dir: String,
        files: [String]
    },
    tests: [{
        type: Schema.Types.ObjectId,
        ref: 'test'
    }],
    // files containing the code for the final test
    solution: {
        dir: String,
        files: [String]
    },
    created: Date,
    deadline: Date,
    type: {
        type: String,
        required: true,
        default: TYPE.EXERCISE
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
taskSchema.methods.isExam = () => {return this.type === TYPE.EXAM;};

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
