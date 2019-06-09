const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
                }
            }

        }
    ],

});

const Test = mongoose.model('test', testSchema);
module.exports = Test;
