const express = require('express');
const user = require('../models/user')

const router = express.Router();

async function isUnique(fieldName, value, model){
    const condition = { }
    condition[fieldName] = value
    const query  = model.findOne(condition)
    const promise = query.exec()
    return await promise.then(document => {
        if(document){
            const result = { 
                error: false
            }
            result[fieldName] = `${fieldName} has already been taken`
            return result
        }
    }).catch( error => {
        if(error){
            return {
                error: true
            }
        }
    })
}

async function checkUnique(newUser, mustUnique, model) {
    const notUnique = { }
    for(i in mustUnique){
        field = mustUnique[i]
        const result = await isUnique(field, newUser[field], model)
        if(result && result.error){
            return {
                error: true
            }
        }
        else if(result && !result.error && result[field]){
                notUnique[field] = result[field]
        }
    }
    if(Object.keys(notUnique).length>0){
        // console.log(notUnique)
        return {
            error: true,
            messages: notUnique
        }
    }
    return {
        error: false
    }
}

function save(newUser) {
    newUser.save((err) => {
        if(err){
            console.log(err)
            return false
        }
        return true
    })
}

function validate(newUser){
    let isError = false
    const errorMessages = { }
    let error = newUser.validateSync();
    if(error && error.errors){
        error = error.errors
        fields = Object.keys(error)
        fields.forEach(field => {
            if(field && error[field].message){
                errorMessages[field] = error[field].message
                isError = true
            }
        })
    }
    return {
        error: isError,
        messages: errorMessages
    }
}

router.post('/signup/', async function(req, res) {
    const { firstname, lastname, email, password } = req.body
    const newUser = new user({
        firstname,
        lastname,
        email,
        password,
        token: 'mmm'
    })
    const { error, messages } = validate(newUser)
        if(error){
            res.status(400).json({
                success: false,
                ...messages
            })
        }
        else{
            const mustUnique = ['email']
            const { error, messages } = await checkUnique(newUser, mustUnique, user)
            if(error == true && messages){
                res.status(400).json({
                    success: false,
                    ...messages
                })
            }
            else if(error == true){
                res.status(500).json({
                    success: false,
                    message: 'some error occurred during sign up'
                })
            }
            else{
                const success = save(newUser)
                if(success){
                    res.status(201).json({
                        success: true,
                        message: 'user has successfully signed up'
                    })
                }
                else{
                    res.status(500).json({
                        success: false,
                        message: 'some error occurred during sign up'
                    })
                }
            }

        }
})

module.exports = router