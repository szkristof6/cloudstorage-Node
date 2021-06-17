const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

/*
 * name - Text
 * path - Array
 * in_trash - Boolean
 * share - Json
 * user - Text
 * created_at - DateTime
 * modified_at - DateTime
 */

const requiredString = {
    type: String,
    required: true,
}

const DirectoriesSchema = new Schema({
    dir_id: requiredString,
    name: requiredString,
    path: {
        type: Array,
        required: true,
    },
    in_trash: {
        type: Boolean,
        default: false,
        required: true,
    },
    share: {
        mode: {
            ...requiredString,
            default: 'none'
        },
        permissions: {
            ...requiredString,
            default: 'read',
        },
    },
    user: requiredString,

}, {
    timestamps: true,
});

const Directories = mongoose.model('Directories', DirectoriesSchema);

module.exports = Directories;