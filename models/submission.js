const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    submissionDate: Date,
    grade: {
        type: Number,
        default: 0
    },
    filePath: String,
    task: {
        type: Schema.Types.ObjectId,
        ref: 'task'
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'student'
    },
    mode: String
});

submissionSchema.pre('save', async function(next) {
    try {
        // TODO add method to calculate grade
        //mock grading, should be some async function
        this.grade = 100;
        next();
    } catch(err) {
        next(err);
    }
});
const Submission = mongoose.model('submission', submissionSchema);
module.exports = Submission;
