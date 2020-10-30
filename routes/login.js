const express = require('express');
const hash = require('../middleware/hash')
const user = require('../models/user')

const router = express.Router();

router.post('/login/', async function(req, res) {
    const { email, password } = req.body
    console.log(`email: ${email}\npassword: ${password}`)
})


module.exports = router