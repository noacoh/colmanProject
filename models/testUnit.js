const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Task = require('./task');

const UNIT_TYPE = {
  IO: 'ioTestUnit',
  MAIN: 'mainTestUnit'
};
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
    },
    type: {
        type: String,
        required: true
    }
});

testUnitSchema.methods.isGeneric = function() {
    return this.task? false : true;
};

testUnitSchema.methods.getTestTask = async function() {
    if (this.isGeneric()) {
        return null;
    }
    return await Task.findById(this.task);
};

const TestUnit = mongoose.model('testUnit', testUnitSchema);
module.exports = {
    TestUnit: TestUnit,
    UNIT_TYPE: UNIT_TYPE
};
