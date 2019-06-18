const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { TestUnit } = require('./testUnit');
const sandbox = require('../docker_sandbox/sandboxWrapper');
const { copyFile, removeFile } = require('../helpers/util');
const { readFile }  = require('fs.promises');
const { logger } = require('../configuration/winston');
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

    for (let i = 0; i < this.mainTests.length; i++) {
        const testConf = this.mainTests[i];
        const testUnit = await TestUnit.findById(testConf.test);
        await copyFile(testUnit.file, sharedDir);
        try {
            const { output, compilationErr } = await sandbox.runInSandbox(sharedDir, testUnit.compilationLine,testConf.configuration.timeout);
            if (output.includes("Compilation Failed")){
                results.push({
                    compilationErr,
                    output,
                    compilationSuccess: false,
                    loss: this.mainTests[i].configuration.weight,
                    visibility: this.mainTests[i].configuration.visibility
                })
            }
            const lossPattern =/(\(-[0-9]{2}\)|\(-100\))'/gm;
            const losses = output.match(lossPattern) || [];
            const loss = losses.reduce((total, loss)=> {
                return total + parseInt(loss.slice(2,-1));
            },0);

            results.push({
                compilationErr,
                output,
                loss: loss < testConf.configuration.weight? loss : testConf.configuration.weight,
                compilationSuccess: true,
                visibility: testConf.configuration.visibility
            });
        } catch (err) {
            throw err;
            // handle err
        } finally {
            removeFile(`${sharedDir}/${testUnit.file.name}`);
        }
    }

    for (let i = 0; i < this.ioTests.length; i++) {
        const testConf = this.ioTests[i];
        const testUnit = await TestUnit.findById(testConf.test);
        await copyFile(testUnit.file.path, sharedDir);
        try {
            const { output, compilationErr } = await sandbox.runInSandbox(sharedDir, testUnit.compilationLine, testConf.configuration.timeout, testConf.configuration.input.file.path);
            if (output.includes("Compilation Failed")){
                results.push({
                    compilationErr,
                    output,
                    compilationSuccess: false,
                    loss: this.mainTests[i].configuration.weight,
                    visibility: this.mainTests[i].configuration.visibility
                })
            } else {
                const expectedOutput = await readFile(testConf.configuration.output.file.path);
                results.push({
                    compilationErr,
                    output,
                    compilationSuccess: true,
                    loss: Buffer.compare(expectedOutput, Buffer.from(output)) === 0 ? 0 : testConf.configuration.weight,
                    visibility: this.mainTests[i].configuration.visibility
                });
            }
        } catch (err) {
            throw err;
            // handle err
        } finally {
            await removeFile(`${sharedDir}/${testUnit.file.name}`);
        }
    }
    const grade = results.reduce(function (total, result) {
        return total - result.loss;
    }, 100);
    const visibleRes = results.filter( res => res.visibility === VISIBILITY.EXPOSED);
    const visibleOut = visibleRes.map( res => {
        return !res.compilationSuccess ? `compilation failed -${res.loss}` : res.output;
    });
    return {
        grade,
        output: visibleOut.join("\n")
    }
};

const Test = mongoose.model('test', testSchema);
module.exports = {
    Test,
    VISIBILITY
};
