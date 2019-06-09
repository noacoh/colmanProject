const TestUnit = require('../models/testUnit');
const IOTestUnit = require('../models/ioTestUnit');
const { UNIT_TEST, OUTPUT_FILE, INPUT_FILE} = require('../configuration/supports').DATA_FORM.FIELD_NAME;

module.exports = {
    index: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const uts = await TestUnit.find({});
        res.status(200).json(uts);
    },
    getTaskUTs: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { taskId } = req.value.params;
        const uts = await TestUnit.find({ task: taskId});
        res.status(200).json(uts);
    },
    getGenericUTs: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { taskId } = req.value.params;
        const uts = await TestUnit.find({ task: null});
        res.status(200).json(uts);
    },
    uploadExeUnitTest: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        req.value.body['file'] = {
            path: req.file.path,
            name: req.file.filename,
            size: req.file.size,
        };
        const ut = new TestUnit(req.value.body);
        await TestUnit.save(ut);
        res.status(203).json({
            success: true,
            message: 'Test was saved successfully'
        })
    },
    uploadIOUnitTest: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        req.value.body['file'] = {
            path: req.file[UNIT_TEST].path,
            name: req.file[UNIT_TEST].filename,
            size: req.file[UNIT_TEST].size,
        };
        req.value.body['input'] = {
            path: req.file[INPUT_FILE].path,
            name: req.file[INPUT_FILE].filename,
            size: req.file[INPUT_FILE].size,
        };
        req.value.body['expectedOutput'] = {
            path: req.file[OUTPUT_FILE].path,
            name: req.file[OUTPUT_FILE].filename,
            size: req.file[OUTPUT_FILE].size,
        };
        const ut = new IOTestUnit(req.value.body);
        await TestUnit.save(ut);
        res.status(203).json({
            success: true,
            message: 'Test was saved successfully'
        })
    },

};
