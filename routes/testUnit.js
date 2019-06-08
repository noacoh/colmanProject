const passport = require('passport');
const passportConf = require('../passport');
const testUnitController = require('../controllers/testUnit');
const router = require('express-promise-router')();

const { RESOURCES } = require('../configuration');
const multer  = require('multer');
const upload = multer({destination:RESOURCES.UNIT_TESTS});

const { UNIT_TEST} = require('../configuration/supports').DATA_FORM.FIELD_NAME;

const passportJWT = passport.authenticate('jwt', {session: false});



router.route('/uploads/ioTest')
    .post(upload.single(UNIT_TEST),
        passportJWT,
        testUnitController.uploadExeUnitTest);

router.route('/uploads/exeTest')
    .get(passportJWT,
        testUnitController.index);

module.exports = router;

