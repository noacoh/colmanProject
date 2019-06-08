const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// test schema holds data for a modular test code
const testUnitSchema = new Schema({
    file: {
        path:{
            type: String,
            required: true
        }
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    compilationLine: {
        type: String,
        required: true
    },
    task:{
        type: Schema.Types.ObjectId,
        ref: 'task',
        require: false
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

const TestUnit = mongoose.model('testUnit', testUnitSchema);
module.exports = TestUnit;
