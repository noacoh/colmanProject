const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Test = require('./test');

const inputTestSchema = new Schema({
    input: {
        file: {
            type: String,
            required: true
        }
    }
});

const InputTest = Test.discriminator('inputTest', inputTestSchema);
module.exports = InputTest;
