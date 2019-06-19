const passport = require('passport');
const passportConf = require('../passport');
const testUnitController = require('../controllers/testUnit');
const router = require('express-promise-router')();

const { resources } = require('../configuration');
const multer  = require('multer');
const storage = multer.diskStorage({
    // configure destination folder for the files
    destination: function (req, file, cb) {
        cb(null, resources.test_units)
    },
    // we want to rename the file, in order to ensure files name is unique
    filename: function (req, file, cb) {
        const [name, extension] =file.originalname.split('.');
        cb(null, `${name}_${Date.now()}.${extension}`)
    }
});
// create file uploader for task exercise files
const upload = multer({storage: storage});

const { UNIT_TEST } = require('../configuration/supports').DATA_FORM.FIELD_NAME;

const passportJWT = passport.authenticate('jwt', {session: false});

const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
    .get(passportJWT,
        testUnitController.index);

router.route('/units/:taskId')
    .get(validateParam(schemas.idSchema, 'taskId'),
        passportJWT,
        testUnitController.getTaskUTs);

router.route('/units')
    .get(passportJWT,
        testUnitController.getGenericUTs);

router.route('/uploads/testUnit')
    .post(upload.single(UNIT_TEST),
        validateBody(schemas.testUnitSchema),
        passportJWT,
        testUnitController.uploadExeUnitTest);

module.exports = router;

