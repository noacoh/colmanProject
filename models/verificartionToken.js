const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
   _userId: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'user'
   },
    token: {
       type: String,
        required: true
    },
    createdAt: {
       type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }

});

const Token = mongoose.model('verificationToken', tokenSchema);
module.exports = Token;
