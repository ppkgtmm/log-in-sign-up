const jwt = require('jsonwebtoken')
const KEY = process.env.KEY

function generateToken(user) {
    const payload = {
        email: user.email,
        exp: new Date().getTime() * 1000 * 60 * 60 * 24 * 7
    }
    const options = {
        issuer: 'sign-in-sign-up'
    }
    return new Promise((resolve, reject) => {
        jwt.sign(payload, KEY, options, (err, token) => {
            if (err) {
                reject(err)
                return
            }
            resolve(token)
        })
    })
}

function decode(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, KEY, (err, decoded) => {
            if (err) {
                reject(err)
                return
            }
            resolve(decoded)
        })
    })
}

module.exports = { generateToken, decode }
