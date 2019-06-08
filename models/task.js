const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TYPE = {
    EXAM: "exam",
    EXERCISE: "exercise"
};

const taskSchema = new Schema({
    title: String,
    exercise: {
        files: [{
            name: String,
            path: String,
            size: Number
        }]
    },
    tests: [{
        type: Schema.Types.ObjectId,
        ref: 'test'
    }],
    // files containing the code for the final test
    solution: {
        files: [{
            name: String,
            path: String,
            size: Number
        }]
    },
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
    }],
    deadline: {
        type: Date,
        required: true
    },
    meta: {
        created: Date
    },

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
