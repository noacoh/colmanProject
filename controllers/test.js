const { Test } = require('../models/test');
const Task = require('../models/task');
const { OUTPUT_FILES, INPUT_FILES} = require('../configuration/supports').DATA_FORM.FIELD_NAME;

module.exports = {
    index: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const tests = await Test.find({});
        res.status(200).json(tests);
    },
    addTest: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { ioTests, mainTests, taskId, mode } = req.value.body;
        const inputFilesMap = {};
        const outputFilesMap = {};
        // map files for test constructor required info
        req.files[INPUT_FILES].forEach(file => {
            inputFilesMap[file.originalname] = {
                path: file.path,
                name: file.filename,
                size: file.size
            }
        });
        req.files[OUTPUT_FILES].forEach(file => {
            outputFilesMap[file.originalname] = {
                path: file.path,
                name: file.filename,
                size: file.size
            }
        });
        let mainTestsArr;
        if (mainTests){
            mainTestsArr = mainTests.map( unit => {
                const {test, visibility, weight, timeout} = unit;
                return {
                    test ,
                    configuration: {
                        visibility,
                        weight,
                        timeout: timeout || 300
                    }
                }
            });
        }
        let ioTestsArr ;
        if (ioTests){
            ioTestsArr = ioTests.map( unit => {
                const {test, visibility, weight, input, output, timeout } = unit;
                return {
                    test ,
                    configuration: {
                        visibility,
                        weight,
                        timeout: timeout || 300,
                        input: { file: inputFilesMap[input] },
                        output: { file: outputFilesMap[output] }
                    }
                }
            })
        }
        const task = await Task.findById(taskId);
        // creat a new test document
        const newTest = new Test({
            ioTests: ioTestsArr,
            mainTests: mainTestsArr,
            mode: mode,
            task: taskId
        });

        const test = await newTest.save();
        // update the task document
        const tests = task.tests;
        tests[mode] = test._id;
        await task.update({test: tests});
        await task.save();

        res.status(201).json({
            success: true,
            message: "New test was created successfully"
        });
    },
};
