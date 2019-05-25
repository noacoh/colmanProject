const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    identityNumber: String,
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }]
});

const User = mongoose.model('user', userSchema);
module.exports = User;
