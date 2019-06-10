const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { TestUnit } = require('./testUnit');
const sandbox = require('../docker_sandbox/sandboxWrapper');
const { copyFile, removeFile } = require('../helpers/util');
const { readFile }  = require('fs.promises');

const VISIBILITY = {
    EXPOSED: 'exposed',
    HIDDEN: 'hidden'
};

const testSchema = new Schema({
    ioTests: [
        {
            test: {
                type: Schema.Types.ObjectId,
                ref: 'testUnit',
                required: true
            },
            configuration: {
                visibility: {
                    type: String,
                    required: true,
                    default: VISIBILITY.EXPOSED
                },
                input: {
                    file: {
                        name: String,
                        path: String,
                        Size: Number
                    }
                },
                output: {
                    file: {
                        name: String,
                        path: String,
                        Size: Number
                    }
                },
                timeout: {
                    type: Number,
                    required: true,
                    default: 300
                },
                weight:{
                    type: Number,
                    required: true
                }
            }

        }
    ],
    mainTests: [
        {
            test: {
                type: Schema.Types.ObjectId,
                ref: 'testUnit',
                required: true
            },
            configuration: {
                visibility: {
                    type: String,
                    required: true,
                    default: VISIBILITY.EXPOSED
                },
                timeout: {
                    type: Number,
                    required: true,
                    default: 300
                },
                weight:{
                    type: Number,
                    required: true
                }
            }

        }
    ],
    task: {
        type: Schema.Types.ObjectId,
        ref: 'task',
        required: true
    }
});

testSchema.methods.run = async function(sharedDir){
    const results = [];

    this.mainTests.forEach(async function(unit) {
        const testUnit = await TestUnit.findById(unit.test);
        await copyFile(testUnit.file.path, sharedDir);
        try {
            const { output, error } = sandbox.runInSandbox(sharedDir, testUnit.compilationLine, unit.configuration.timeout);
            if (output.includes("Compilation Failed")){
                mainTests.push({
                    error,
                    output,
                    compilationSuccess: false,
                    loss: unit.configuration.weight,
                    visibility: unit.configuration.visibility
                })
            }
            const lossPattern =/(\(-[0-9]{2}\)|\(-100\))'/gm;
            const losses = output.match(lossPattern);
            const loss = losses.reduce((total, loss)=> {
                return total + parseInt(loss.slice(2,-1));
            },0);

            results.push({
                error,
                output,
                loss: loss > unit.configuration.weight? loss : unit.configuration.weight,
                compilationSuccess: true,
                visibility: unit.configuration.visibility
            });
        } catch (err) {
            throw err;
            // handle err
        } finally {
            removeFile(`${sharedDir}/${testUnit.file.name}`);
        }
    });
    this.ioTests.forEach(async function(unit) {
        const testUnit = await TestUnit.findById(unit.test);
        await copyFile(testUnit.file.path, sharedDir);
        try {
            const { output, error } = sandbox.runInSandbox(sharedDir, testUnit.compilationLine, unit.configuration.timeout, unit.configuration.input.file.path);
            if (output.includes("Compilation Failed")){
                results.push({
                    error,
                    output,
                    compilationSuccess: false,
                    loss: unit.configuration.weight,
                    visibility: unit.configuration.visibility
                })
            } else {
                const expectedOutput = await readFile(unit.configuration.output.file.path);
                results.push({
                    error,
                    output,
                    compilationSuccess: true,
                    loss: Buffer.compare(expectedOutput, Buffer.from(output)) === 0 ? 0 : unit.configuration.weight,
                    visibility: unit.configuration.visibility
                });
            }
        } catch (err) {
            throw err;
            // handle err
        } finally {
            removeFile(`${sharedDir}/${testUnit.file.name}`);
        }
    });
    const grade = results.reduce(function (total, result) {
        return total - result.loss;
    }, 100);
    const visibleRes = results.filter( res => res.visibility);
    const visibleOut = visibleRes.map( res => {
        return res.compilationSuccess ? `compilation failed -${res.loss}` : re.output;
    });
    return {
        grade,
        output: visibleOut.join("\n")
    }
};

const Test = mongoose.model('test', testSchema);
module.exports = {
    Test,
    VISIBILITY,};
