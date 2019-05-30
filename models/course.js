const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: String,
    year: Number,
    enrolled: [{
        type: Schema.Types.ObjectId,
        ref: 'student'
    }]
});

courseSchema.methods.studentIsRegisteredForCourse = function(studentId) {
    return this.enrolled.includes(studentId);
};

const Course = mongoose.model('course', courseSchema);
module.exports = Course;

