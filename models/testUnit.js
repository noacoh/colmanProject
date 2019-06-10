const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sandbox = require('../docker_sandbox/sandboxWrapper');
const {copyFile, removeFile} = require('../helpers/util');

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

testUnitSchema.methods.getTestTask = function() {
    if (this.isGeneric()) {
        return null;
    }
    this.populate('task');
    return this.task;
};

// sharedDir is the shared directory where the submission files can be found.
testUnitSchema.methods.runTest = async (sharedDir)=> {
    // copy the test file to the shared directory

    await copyFile(this.file , sharedDir);
    try {
        sandbox.runInSandbox(sharedDir,);
    } catch (err) {

    } finally {
        removeFile(`${sharedDir}/${this.file.name}`);
    }
};

const TestUnit = mongoose.model('testUnit', testUnitSchema);
module.exports = TestUnit;
