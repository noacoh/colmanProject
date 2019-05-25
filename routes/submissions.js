
const router = require('express-promise-router')();
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

const SubmissionController = require('../controllers/submissions');

router.route('/')
    .get(SubmissionController.index);

router.route('/:submissionId')
    .get([validateParam(schemas.idSchema, 'submissionId'),
        validateBody(schemas.submissionSchema)],
        SubmissionController.getSubmission);

router.route('/:taskId/submissions')
    .get(validateParam(schemas.idSchema, 'taskId'),
        SubmissionController.getTaskSubmissions);

router.route('/:userId/submissions')
    .get(validateParam(schemas.idSchema, 'userId'),
        SubmissionController.getUserSubmissions);

module.exports = router;