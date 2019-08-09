const { TestUnit } = require('../models/testUnit');

module.exports = {
    index: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
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
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
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
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const uts = await TestUnit.find({ task: null});
        if (!uts){
            res.status(400).json({
                success: false,
                message: 'No tests were found'
            });
        }
        res.status(200).json(uts);
    },
    uploadExeUnitTest: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin() && !resourceRequester.isTeachingAssistant()) {
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
        await ut.save(ut);
        res.status(201).json({
            success: true,
            message: 'Test was saved successfully'
        })
    }
};
