const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

/*
 * id - Uuid
 * dir_id - Uuid
 * name - Text
 * path - Array
 * in_trash - Boolean
 * meta - Json
 * share - Json
 * user - Text
 * created_at - DateTime
 * modified_at - DateTime
 */

const requiredString = {
    type: String,
    required: true,
}

const FilesSchema = new Schema({
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
    meta: {
        size: {
            type: Number,
            required: true,
        },
        type: requiredString,
        lastModified: {
            type: Date,
            required: true
        },
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

const Files = mongoose.model('Files', FilesSchema);

module.exports = Files;