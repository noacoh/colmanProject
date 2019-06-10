const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { runInSandbox } = require('../docker_sandbox/sandboxWrapper');
const { removeFile, removeFromArray } = require('../helpers/util');
const Task = require('./task');
const MODE = {
    PRACTICE: 'practice',
    FINAL: 'final'
};


const submissionSchema = new Schema({
    submissionDate: Date,
    grade: {
        type: Number,
        default: 0
    },
    files: [{
        name: String,
        path: String,
        size: Number
    }],
    task: {
        type: Schema.Types.ObjectId,
        ref: 'task'
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'student'
    },
    mode: {
        type: String,
        required: true,
    }
});

submissionSchema.pre('save', async function(next) {
    try {
        // TODO add method to calculate grade (long async function.....)
        const { output, execTime, error} = await runInSandbox()
        //mock grading, should be some async function
        this.grade = 100;
        next();
    } catch(err) {
        next(err);
    }
});

submissionSchema.post('remove', async function(next) {
    try {
        // remove student from task's submitted list
        const task = await Task.findById(this.task);
        removeFromArray(task.studentSubmissions, this.student);
        await task.save();
        // remove files
        this.files.forEach( file => removeFile(file.path));
        next();
    } catch(err) {
        next(err);
    }
});

const Submission = mongoose.model('submission', submissionSchema);
module.exports = {
    Submission,
    MODE
};
