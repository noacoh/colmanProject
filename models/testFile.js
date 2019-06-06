const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VISIBILITY = {
    HIDDEN: "hidden",
    EXPOSED: "exposed"
};

const testFileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // full path to file
    file: {
        type: String,
        required: true
    },
    configuration: {
        visibility: {
            type: String,
            required: true,
            default: VISIBILITY.HIDDEN
        }
    }
});

const TestFile = mongoose.model('testFile', testFileSchema);

module.exports = {
    TestFile,
    VISIBILITY
};
