const { Test } = require('../models/test');

module.exports = {
    index: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
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
        if (!resourceRequester.isAdmin && !resourceRequester.isTeachingAssistant) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const { units } = req.value.body;
        const test = new Test({units});
        await test.save();
        res.status(203).json({
            success: true,
            message: "New test was created successfully"
        });
    },
};
