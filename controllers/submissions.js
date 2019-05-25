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
    },
    getTaskSubmissions: async (req, res, next) => {
        const { taskId } = req.value.params;
        const submissions = await Submission.findById(taskId).toArray();
        res.status(200).json(submissions);
    },
    getUserSubmissions: async (req, res, next) => {
        const { userId } = req.value.params;
        const submissions = await Submission.findById(userId).toArray();
        res.status(200).json(submissions);
    }
};