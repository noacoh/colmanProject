const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user');

const StudentSchema = new Schema({
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }],
    log: {
        file: String
    }
});

const Student = User.discriminator('student', StudentSchema);
module.exports = Student;
