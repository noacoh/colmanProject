const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: String,
    year: String
});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;

