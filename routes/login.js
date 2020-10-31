const express = require('express');
const { doesMatch } = require('../middleware/hash')
const { getOne } = require('../utils/database')
const filter = require('../utils/object')
const generateToken = require('../middleware/jwt')
const user = require('../models/user')

const router = express.Router();

router.post('/login/', async function(req, res) {
    const noneHidden = ['firstname', 'lastname', 'email', 'token']
    const { email, password } = req.body
    const { document } = await getOne(['email'], [email], user, [])
    if(document && document.password){
        const matched = await doesMatch(password, document.password)
        if(matched === true){
            if(document.token && document.token.trim().length>0){
                console.log(document.token)
            }
            else{
                const token = await generateToken(document)
                const condition = {
                    _id: document._id
                }
                const updated = await user.findByIdAndUpdate(condition, { token }, { new: true })
                if(updated && updated._doc){
                    res.status(200).json({
                        success: true,
                        data: {
                            ...filter(updated._doc, noneHidden)
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
        }
        else if(matched === false){
            // status code may be wrong
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