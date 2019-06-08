const TestUnit = require('../models/testUnit');

module.exports = {
    uploadExeUnitTest: async (req, res, next) => {
        const resourceRequester = req.user;
        if (!resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

    },

};
