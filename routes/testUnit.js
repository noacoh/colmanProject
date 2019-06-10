const passport = require('passport');
const passportConf = require('../passport');
const testUnitController = require('../controllers/testUnit');
const router = require('express-promise-router')();

const { resources } = require('../configuration');
const multer  = require('multer');
// create file uploader for task exercise files
const upload = multer({
    // configure destination folder for the files
    destination: resources.test_units,
    // we want to rename the file, in order to ensure files name is unique
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
});

const { UNIT_TEST, OUTPUT_FILE, INPUT_FILE} = require('../configuration/supports').DATA_FORM.FIELD_NAME;

const passportJWT = passport.authenticate('jwt', {session: false});

const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');



router.route('/')
    .get(passportJWT,
        testUnitController.index);

router.route('/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        testUnitController.getTaskUTs);

router.route('/genericTests')
    .get(passportJWT,
        testUnitController.getGenericUTs);

router.route('/uploads/testUnit')
    .post(upload.single(UNIT_TEST),
        validateBody(schemas.testUnitSchema),
        passportJWT,
        testUnitController.uploadExeUnitTest);

module.exports = router;

