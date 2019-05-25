const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: String,
    year: Number,
    enlisted: {
        type: Schema.Types.ObjectId,
        ref: 'student'
    }
});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;

