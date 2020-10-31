const jwt = require('jsonwebtoken')
const { KEY } = require('../config')
function generateToken(user){
    const payload = {
        email: user.email
    }
    const options = {
        issuer: 'sign-in-sign-up',
        expiresIn: '7d'
    }
    return jwt.sign(payload, KEY, options)
}

module.exports = generateToken