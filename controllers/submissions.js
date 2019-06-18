const { Submission } = require('../models/submission');

module.exports = {
    index: async (req, res, next) => {
        const submissions = await Submission.find({});
        res.status(200).json(submissions);
    },
    getSubmission: async (req, res, next) => {
        const resourceRequester = req.user;
        const { submissionId } = req.value.params;
        const submission = await Submission.findById(submissionId);
        if (resourceRequester.id !== submission.student && !resourceRequester.isAdmin()) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        res.status(200).json(submission);
    }
};
