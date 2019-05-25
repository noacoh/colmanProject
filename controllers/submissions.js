const Submission = require('../models/submission');

module.exports = {
    index: async (req, res, next) => {
        const submissions = await Submission.find({});
        res.status(200).json(submissions);
    },
    getSubmission: async (req, res, next) => {
        const { submissionId } = req.value.params;
        const submission = await Submission.findById(submissionId);
        res.status(200).json(submission);
    }
};