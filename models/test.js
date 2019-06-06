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
    }
});

const Test = mongoose.model('test', test);
module.exports = Test;
