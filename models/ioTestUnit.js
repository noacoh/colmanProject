const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TestUnit = require('./testUnit');

const ioTestUintSchema = new Schema({
    input: {
        file: {
            name: {
                type: String,
                required: true
            },
            path: {
                type: String,
                required: true
            },
            size: {
                type: Number,
                required: true
            }
        }
    },
    expectedOutput: {
        file: {
            name: {
                type: String,
                required: true
            },
            path: {
                type: String,
                required: true
            },
            size: {
                type: Number,
                required: true
            }
        }
    },
});

const IOTestUnit = TestUnit.discriminator('inputTestUnit', ioTestUintSchema);
module.exports = IOTestUnit;
