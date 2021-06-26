const express = require('express')
const homePageHandler = require('../handlers/home')
const signupHandler = require('../handlers/signup')
const loginHandler = require('../handlers/login')

const router = express.Router()

router.get('/', homePageHandler)

router.post('/v1/login/', loginHandler)

router.post('/v1/signup/', signupHandler)

router.all('*', (req, res) => {
    res.status(404).json({
        error: 'unknown path specified',
    })
})

module.exports = router
