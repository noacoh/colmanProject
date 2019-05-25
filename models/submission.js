const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const
    submissionSchema = new Schema({
    submissionDate: Date,
    grade: Number,
    filePath: String,
    task: [{
        type: Schema.Types.ObjectId,
        ref: 'task'
    }],
    student: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
});
const Submission = mongoose.model('submission', submissionSchema);
module.exports = Submission;