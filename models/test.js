const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TestUnit = require('./testUnit');
const VISIBILITY = {
    EXPOSED: 'exposed',
    HIDDEN: 'hidden'
};



const testSchema = new Schema({
    units: [
        {
            test: {
                type: Schema.Types.ObjectId,
                ref: 'testUnit',
                required: true
            },
            configuration: {
                visibility: {
                    type: String,
                    required: true,
                    default: VISIBILITY.EXPOSED
                },
                timeout: {
                    type: Number,
                    required: true,
                    default: 300
                },
                type: {

                }
            }

        }
    ],
    task: {
        type: Schema.Types.ObjectId,
        ref: 'task',
        required: true
    }
});

testSchema.methods.run = async function(sharedDir){
        // const results = this.units.map((unit)=>{
        // const testUnit = TestUn
    // })
};

const Test = mongoose.model('test', testSchema);
module.exports = {
    Test,
    VISIBILITY,};
