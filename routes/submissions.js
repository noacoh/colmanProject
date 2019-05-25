
const router = require('express-promise-router')();
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

const SubmissionController = require('../controllers/submissions');

router.route('/')
    .get(SubmissionController.index);

router.route('/:submissionId')
    .get([validateParam(schemas.idSchema, 'submissionId'),
        validateBody(schemas.submissionSchema)],
        SubmissionController.getSubmission);

module.exports = router;