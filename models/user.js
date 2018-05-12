const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} it´s not valid role'
}

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    img: { type: String },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles },
    google: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} email is already taken' });

module.exports = mongoose.model('User', userSchema);