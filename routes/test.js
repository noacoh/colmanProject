const passport = require('passport');
const passportConf = require('../passport');
const testController = require('../controllers/test');
const router = require('express-promise-router')();

const passportJWT = passport.authenticate("jwt", {session: false});

const {validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
    .get(passportJWT,
        testController.index)
    .post(validateBody(schemas.testSchema),
        passportJWT,
        testController.addTest
    );

module.exports = router;

