const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TestUnit = require('./testUnit');
const {copyFile, removeFile} = require('../helpers/util');
const { readFile }  = require('fs.promises');



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

// sharedDir is the shared directory where the submission files can be found.
ioTestUintSchema.methods.runTest = async function(sharedDir, timeout){
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
        } else {
            const expectedOutput = await readFile(this.expectedOutput.file.path);
            return {
                error,
                output,
                compilationSuccess: true,
                compare: Buffer.compare(expectedOutput, Buffer.from(output))
            }
        }
    } catch (err) {
        throw err;
        // handle err
    } finally {
        await removeFile(`${sharedDir}/${this.file.name}`);
    }
};

const IOTestUnit = TestUnit.discriminator('inputTestUnit', ioTestUintSchema);
module.exports = IOTestUnit;
