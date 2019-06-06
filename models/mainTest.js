const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Test = require('./test');

const mainTestSchema = new Schema({});

const MainTest = Test.discriminator('mainTest', mainTestSchema);
module.exports = MainTest;
