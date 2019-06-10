const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sandbox = require('../docker_sandbox/sandboxWrapper');
const {copyFile, removeFile} = require('../helpers/util');
const Task = require('./task');

// test schema holds data for a modular test code
const testUnitSchema = new Schema({
    file: {
        path: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    compilationLine: {
        type: String,
        required: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'task',
        default: null
    }
});

testUnitSchema.methods.isGeneric = function() {
    return this.task? false : true;
};

testUnitSchema.methods.getTestTask = async function() {
    if (this.isGeneric()) {
        return null;
    }
    const task = await Task.findById(this.task);
    return task;
};

// sharedDir is the shared directory where the submission files can be found.
testUnitSchema.methods.runTest = async (sharedDir, timeout)=> {
    // copy the test file to the shared directory
    await copyFile(this.file , sharedDir);
    try {
        const { output, error } = sandbox.runInSandbox(sharedDir, this.compilationLine, timeout);
        if (output.includes("Compilation Failed")){
            return {
                error,
                output,
                compilationSuccess: false
            }
        }
    const lossPattern =/(\(-[0-9]{2}\)|\(-100\))'/gm;
    const losses = output.match(lossPattern);
    const loss = losses.reduce((total, loss)=> {
        return total + parseInt(loss.slice(2,-1));
    },0);
    return {
        error,
        output,
        loss,
        compilationSuccess: true
    }
    } catch (err) {
        throw err;
        // handle err
    } finally {
        removeFile(`${sharedDir}/${this.file.name}`);
    }
};

const TestUnit = mongoose.model('testUnit', testUnitSchema);
module.exports = TestUnit;
