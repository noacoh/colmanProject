const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TYPE = {
  INPUT: "input",
  MAIN: "main"
};

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
        ref: 'test'
    }]
});

const Test = mongoose.model('test', test);
module.exports = {
    Test,
    TYPE
};
