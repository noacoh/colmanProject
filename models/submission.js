const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { removeFile, removeFromArray, createDirectoryIfNotExists, copyFile, deleteDir } = require('../helpers/util');
const { resources } = require("../configuration");
const Task = require('./task');
const { Test } = require('./test');
const { logger } = require("../configuration/winston");
// const {asyncForEach} = require('../helpers/util');
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
    const newDir = `${resources.docker.temp}/temp${Date.now()}`;
    const task = await Task.findById(this.task);
    await createDirectoryIfNotExists(newDir);
    try {
        for (let i = 0; i < this.files.length; i++) {
            await copyFile(this.files[i], newDir);
        }
        let test = null;
        if (this.mode === MODE.PRACTICE){
            test = await Test.findById(task.tests.practice)
        } else {
            test = await Test.findById(task.tests.final);
        }

        const {output, grade} = await test.run(newDir);

        logger.debug(JSON.stringify({output, grade}));
        this.output = output;
        this.grade = grade;
        return { output, grade }
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
