const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TestUnit = require('./testUnit');

const inputTestUintSchema = new Schema({
    input: {
        file: {
            type: String,
            required: true
        }
    },
    expectedOutput: {
        file: {
            type: String,
            required: true
        }
    },
});

const InputTestUnit = TestUnit.discriminator('inputTestUnit', inputTestUintSchema);
module.exports = InputTestUnit;
