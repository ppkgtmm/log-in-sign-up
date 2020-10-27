const mongoose = require('mongoose')


const user = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'firstname cannot be empty'],
        maxlength: 128
    },
    lastname: {
        type: String,
        required: [true, 'lastname cannot be empty'],
        maxlength: 128
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'password is required'],
        minlength: 8
    },
    token:{
        type: String
    }
})

module.exports = mongoose.model('User', user)