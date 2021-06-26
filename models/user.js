const mongoose = require('mongoose')

const user = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'firstname cannot be empty'],
        maxlength: [128, 'firstname is too long'],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, 'lastname cannot be empty'],
        maxlength: [128, 'lastname is too long'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [8, 'length of password should be at least 8 characters'],
    },
    token: {
        type: String,
    },
})

module.exports = mongoose.model('User', user)
