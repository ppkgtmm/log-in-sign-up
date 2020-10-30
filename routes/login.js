const express = require('express');
const { doesMatch } = require('../middleware/hash')
const { getOne } = require('../utils/database')
const user = require('../models/user')

const router = express.Router();

router.post('/login/', async function(req, res) {
    const { email, password } = req.body
    const { document } = await getOne(['email'], [email], user, [])
    if(document && document.password){
        const matched = await doesMatch(password, document.password)
        if(matched === true){
            
        }
        else if(matched === false){
            res.status(400).json({
                success: false,
                messages: {
                   error: 'email or password is invalid'
                }
            })
        }
        else{
            res.status(500).json({
                success: false,
                messages: {
                    error: 'some error occurred during log in'
                }
            })
        }
    }
    

})


module.exports = router