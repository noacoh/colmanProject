const passport = require('passport');
const passportConf = require('../passport');
const testController = require('../controllers/test');
const router = require('express-promise-router')();

const { resources } = require('../configuration');
const { OUTPUT_FILES, INPUT_FILES} = require('../configuration/supports').DATA_FORM.FIELD_NAME;
const { MAX_UPLOADS } = require('../configuration/supports');

const multer  = require('multer');

const storage = multer.diskStorage({
    // configure destination folder for the files
    destination: function (req, file, cb) {
        cb(null, resources.ios);
    },
    // we want to rename the file, in order to ensure files name is unique
    filename: function (req, file, cb) {
        const [name, extension] =file.originalname.split('.');
        cb(null, `${name}_${Date.now()}.${extension}`)
    }
});
// create file uploader for task exercise files
const upload = multer({storage: storage});

const passportJWT = passport.authenticate("jwt", {session: false});

const {validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
    .get(passportJWT,
        testController.index)
    .post(upload.fields([{name: OUTPUT_FILES, maxCount: MAX_UPLOADS}, {name: INPUT_FILES, maxCount: MAX_UPLOADS}]),
        validateBody(schemas.testSchema),
        passportJWT,
        testController.addTest
    );

module.exports = router;

