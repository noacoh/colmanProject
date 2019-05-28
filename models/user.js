const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

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
    admin: {
        type: Boolean,
        required: true,
        default: false
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

userSchema.methods.isAdmin = function() {
    return this.admin;
};

userSchema.methods.FullName = function() {
    return this.firstName + ' ' + this.lastName;
};

const User = mongoose.model('user', userSchema);
module.exports = User;
