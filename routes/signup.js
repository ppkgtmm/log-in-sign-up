const express = require('express');
const validate = require('../utils/validate')
const {getOne,save} = require('../utils/database')
const filter = require('../utils/object')
const {hash} = require('../middleware/hash')
const user = require('../models/user')

const router = express.Router();

async function checkUnique(newDoc, mustUnique, model) {
    const notUnique = { }
    for(i in mustUnique){
        field = mustUnique[i]
        value = newDoc[field]
        const result = await getOne([field], [value], model, [field])
        if(result && result.error === true){
            return { error: true }
        }
        else if(result && result.error === false && result.document){
                notUnique[field] = `${field} has already been taken`
        }
    }
    if(Object.keys(notUnique).length>0){
        return {
            error: true,
            messages: notUnique
        }
    }
    return { error: false }
}


function isValidEmail(email){
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
}

router.post('/signup/', async function(req, res) {
    const saltRounds = 10
    const newUser = new user({
        ...req.body
    })
    const nonHidden = ['firstname','lastname','email']
    const { error, messages } = validate(newUser)
        if(error){
            res.status(400).json({
                success: false,
                messages: {
                    ...messages
                }
            })
        }
        else{
            if(isValidEmail(newUser.email) === true){
                const mustUnique = ['email']
                const { error, messages } = await checkUnique(newUser, mustUnique, user)
                if(error === true && messages){
                    res.status(400).json({
                        success: false,
                        messages: {
                            ...messages
                        }
                    })
                }
                else if(error === true){
                    res.status(500).json({
                        success: false,
                        messages: {
                           error: 'some error occurred during sign up'
                        }
                    })
                }
                else{
                    const hashed = await hash(newUser.password, saltRounds)
                    if(hashed){
                        newUser.password = hashed
                        newUser.token = ""
                        const { error, _doc } = await save(newUser)
                        if(!error && _doc){
                            res.status(201).json({
                                success: true,
                                data: {
                                    ...filter(_doc, nonHidden)
                                }
                            })
                        }
                        else{
                            res.status(500).json({
                                success: false,
                                messages: {
                                    error: 'some error occurred during sign up'
                                }
                            })
                        }
                    }
                    else{
                        res.status(500).json({
                            success: false,
                            messages: {
                               error: 'some error occurred during sign up'
                            }
                        })
                    }
                }
            }
            else{
                res.status(400).json({
                    success: false,
                    messages: {
                        email: "email has invalid format"
                    }
                })
            }

        }
})

module.exports = router