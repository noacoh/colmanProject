const passport = require('passport');
const passportConf = require('../passport');

const router = require('express-promise-router')();
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

const SubmissionController = require('../controllers/submissions');
const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/')
    .get(SubmissionController.index);

router.route('/:submissionId')
    .get(validateParam(schemas.idSchema, 'submissionId'),
        passportJWT,
        SubmissionController.getSubmission);

module.exports = router;