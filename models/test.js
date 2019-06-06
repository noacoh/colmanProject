const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema({
    testFiles:[{
        type: Schema.Types.ObjectId,
        ref: 'testFile'
    }],
    compilation: {
        type: String,
        required: true
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'task'
    }]
});

const Test = mongoose.model('test', testSchema);
module.exports = Test;
