const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const PERMISSION = {
    ADMIN: "admin",
    TEACHING_ASSISTANT: "teachingAssistant",
    STUDENT: "student"
};

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    identityNumber: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    permission: {
        type: String,
        required: true,
        default: PERMISSION.STUDENT
    },
    email: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(next) {
    try {
        // generate a salt
        const salt = await bcrypt.genSalt(10);
        // generate password hash
        // re-assign hashed version over original, plain-text password;
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch(err) {
        next(err);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(isNew, this.password);
    }catch (err) {
        throw new Error(err);
    }
};

userSchema.virtual.isAdmin = function() {
    return this.permission === PERMISSION.ADMIN;
};

userSchema.virtual.isTeachingAssistant = function() {
    return this.permission === PERMISSION.TEACHING_ASSISTANT;
};

userSchema.virtual.fullName = function() {
    return this.firstName + ' ' + this.lastName;
};

const User = mongoose.model('user', userSchema);
module.exports = User;
