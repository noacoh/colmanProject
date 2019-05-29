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
    mode: {
        type: String,
        required: true,
    }
});

submissionSchema.pre('save', async function(next) {
    try {
        // TODO add method to calculate grade (long async function.....)
        //mock grading, should be some async function
        this.grade = 100;
        next();
        // TODO return err when trying to submit more than once on final mode for an 'exam' task
    } catch(err) {
        next(err);
    }
});

submissionSchema.post('remove', async function(next) {
    try {
        // TODO delete file
        next();
    } catch(err) {
        next(err);
    }
});
const Submission = mongoose.model('submission', submissionSchema);
module.exports = Submission;
