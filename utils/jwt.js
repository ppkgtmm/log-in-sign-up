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
    return new Promise(function(resolve, reject){
        jwt.sign(payload, KEY, options, function(err, token){
            if (err){
                reject(err)
                return
            }
            resolve(token)
        })
    })
}

function decode(token){
    return new Promise(function(resolve, reject){
        jwt.verify(token, KEY, function(err, decoded){
            if (err){
                reject(err)
                return
            }
            resolve(decoded)
        })
    })
}

module.exports = { generateToken , decode }