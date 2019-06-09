const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: String,
    year: Number,
    enlisted: [{
        type: Schema.Types.ObjectId,
        ref: 'student'
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'task'
    }]
});

courseSchema.methods.studentIsRegisteredForCourse = function(studentId) {
    return this.enlisted.includes(studentId);
};

const Course = mongoose.model('course', courseSchema);
module.exports = Course;

