const express = require('express');
const validate = require('../utils/validate')
const {getOne,save} = require('../utils/database')
const response = require('../utils/response')
const filter = require('../utils/object')
const {hash} = require('../middleware/hash')
const user = require('../models/user');

const router = express.Router();
const saltRounds = 10
const nonHidden = ['firstname','lastname','email']
const mustUnique = ['email']

async function checkUnique(newDoc, mustUnique, model) {
    const notUnique = { }
    for(i in mustUnique){
        field = mustUnique[i]
        if(newDoc[field] === undefined){
            return
        }
        value = newDoc[field]
        const result = await getOne([field], [value], model, [field])
        if(result && result.error === true){
            return
        }
        else if(result && result.error === false && result.document){
                notUnique[field] = `${field} has already been taken`
        }
    }
    return notUnique
}


function isValidEmail(email){
    email = email.trim()
    if(email.includes(" ")){
        return false
    }
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
}

async function register(newUser) {
    const hashed = await hash(newUser.password, saltRounds)
    if(hashed){
        newUser.password = hashed
        newUser.token = ""
        const { error, _doc } = await save(newUser)
        if(!error && _doc){
            return filter(_doc, nonHidden)
        }
        else{
            return
        }
    }
    return
}
router.post('/signup/', async function(req, res) {
    const serverErrorMessage = { error: 'some error occurred during sign up' }
    const newUser = new user({
        ...req.body
    })
    const { error, messages } = validate(newUser)
        if(error === undefined && !messages){
            response(res, 500, { }, serverErrorMessage, { })
        }
        else if(error){
            response(res, 400, { }, messages, { })
        }
        else{
            if(isValidEmail(newUser.email) === true){
                const notUnique = await checkUnique(newUser, mustUnique, user)
                if(!notUnique){
                    response(res, 500, { }, serverErrorMessage, { })
                }
                else if(notUnique && Object.keys(notUnique).length>0){
                    response(res, 400, { }, notUnique, { })
                }
                else{
                    const data = await register(newUser)
                    if(data){
                        response(res, 201, { }, '' , data)
                    }
                    else{
                        response(res, 500, { }, serverErrorMessage, { })
                    }
                }
            }
            else{
                const messages = { email:"email has invalid format" }
                response(res, 400, { }, messages, { })
            }

        }
})

module.exports = router