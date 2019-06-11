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
        // logger.debug(`@@@unit: ${JSON.stringify(unit)}`);
        const testUnit = await TestUnit.findById(this.mainTests[i].test);
        logger.debug(`@@@testunit: ${JSON.stringify(testUnit)}`);
        logger.debug(`@@@file: ${JSON.stringify(testUnit.file)}`);
        await copyFile(testUnit.file, sharedDir);
        try {
            const { output, compilationErr } = await sandbox.runInSandbox(sharedDir, testUnit.compilationLine, this.mainTests[i].configuration.timeout);
            logger.debug('@@@ RESULTS FROM SANDBOX ARRIVED!');
            logger.debug(JSON.stringify({output, compilationErr}));
            if (output.includes("Compilation Failed")){
                logger.debug('DETECTED COMPILATION FAILED IN OUTPUT');
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
                loss: loss < this.mainTests[i].configuration.weight? loss : this.mainTests[i].configuration.weight,
                compilationSuccess: true,
                visibility: this.mainTests[i].configuration.visibility
            });
        } catch (err) {
            throw err;
            // handle err
        } finally {
            removeFile(`${sharedDir}/${testUnit.file.name}`);
        }
    }

    for (let i = 0; i < this.ioTests.length; i++) {
        const testUnit = await TestUnit.findById(this.ioTests[i].test);
        await copyFile(testUnit.file.path, sharedDir);
        try {
            const { output, compilationErr } = await sandbox.runInSandbox(sharedDir, testUnit.compilationLine, this.mainTests[i].configuration.timeout, this.mainTests[i].configuration.input.file.path);
            if (output.includes("Compilation Failed")){
                results.push({
                    compilationErr,
                    output,
                    compilationSuccess: false,
                    loss: this.mainTests[i].configuration.weight,
                    visibility: this.mainTests[i].configuration.visibility
                })
            } else {
                const expectedOutput = await readFile(unit.configuration.output.file.path);
                results.push({
                    compilationErr,
                    output,
                    compilationSuccess: true,
                    loss: Buffer.compare(expectedOutput, Buffer.from(output)) === 0 ? 0 : this.mainTests[i].configuration.weight,
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
    logger.debug(`@@@ RESULTS ARRAY ${JSON.stringify(results)}`);
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
