const express = require('express');
const user = require('../models/user')

const router = express.Router();

async function getDocument(fields, values, model, wanted){
    let condition = { }
    if(fields.length !== values.length){
        return { error: true }
    }
    for(i in values){
        condition[fields[i]] = values[i]
    }
    const columns = wanted.reduce((latest, current) => {
        return `${latest} ${current}`
    }).trim()
    const query  = model.findOne(condition).select(columns)
    const promise = query.exec()
    return await promise.then(document => {
        if(document && document._doc){
            return {
                error: false,
                document: {
                    ...document._doc
                }
            }
        }
        return { error: false }
    }).catch( error => {
        if(error){
            return { error: true }
        }
    })
}

async function checkUnique(newObject, mustUnique, model) {
    const notUnique = { }
    for(i in mustUnique){
        field = mustUnique[i]
        value = newObject[field]
        const result = await getDocument([field], [value], model, [field])
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

async function save(newObject, select) {
    try{
        const savedUser = await newObject.save()
        if(savedUser && savedUser._doc){
            const selected = { }
            for(i in select){
                if(savedUser._doc[select[i]]){
                    selected[select[i]] = savedUser._doc[select[i]]
                }
            }
            return {
                error: false,
                selected
            }
        }
        return { error: true }
    }
    catch(error){
        console.log(error)
        return { error: true }
    }
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
    const newUser = new user({
        ...req.body
    })
    const nonHidden = ['firstname','lastname','email']
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
            if(error === true && messages){
                res.status(400).json({
                    success: false,
                    ...messages
                })
            }
            else if(error === true){
                res.status(500).json({
                    success: false,
                    message: 'some error occurred during sign up'
                })
            }
            else{
                const { error, selected } = await save(newUser, nonHidden)
                if(!error && selected){
                    res.status(201).json({
                        success: true,
                        data: {
                            ...selected
                        }
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