const mongoose = require('mongoose');
require('mongoose-type-email');

const { Schema } = mongoose;

/*
    * id - Uuid
    * email - Email
    * username - Text
    * password - Hash
    * role - Text
    * active - Boolean
    * login_ip - IPv4
    * created_at - DateTime
    * modified_at - DateTime
*/

const requiredString = {
    type: String,
    required: true,
}

const UserDataSchema = new Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    username: requiredString,
    password: requiredString,
    role: requiredString,
    active: {
        type: Boolean,
        required: true
    },
    login_ip: requiredString

}, {
    timestamps: true,
});

const UserData = mongoose.model('UserData', UserDataSchema);

module.exports = UserData;