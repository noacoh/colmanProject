const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { removeFile, removeFromArray, createDirectoryIfNotExists, copyFile, deleteDir } = require('../helpers/util');
const { resources } = require("../configuration");
const Task = require('./task');
const { Test } = require('./test');
const MODE = {
    PRACTICE: 'practice',
    FINAL: 'final'
};


const submissionSchema = new Schema({
    submissionDate: Date,
    grade: {
        type: Number,
        default: -1
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
    },
    output: String

});

submissionSchema.methods.submit = async function(){
    const newDir = `${resources.docker.temp}/temp${new Date().getTime()}`;
    const task = await Task.findById(this.task);
    await createDirectoryIfNotExists(newDir);
    try {
        await this.files.forEach(async function(file) {
            await copyFile(file, newDir);
        });
       const test = this.mode === MODE.PRACTICE ? await Test.findById(task.tests.practice) : await Test.findById(task.tests.final);
       const {output, grade} = await test.run(newDir);
       this.output = output;
       this.grade = grade;
       return {
           output,
           grade
       }
    } catch (err) {
        throw err
    } finally {
        await deleteDir(newDir);
    }
};

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
