const { doesMatch } = require("../utils/hash")
const { getOne } = require("../utils/database")
const response = require("../utils/response")
const {filter} = require("../utils/object")
const { generateToken, decode } = require("../utils/jwt")
const user = require("../models/user")

const noneHidden = ["firstname", "lastname", "email", "token"]
const serverError = { error: "some error occured during login" }
const clientError = { error: "email or password is incorrect" }
const incomplete = { error: "both email and password are required" }

async function updateToken(targetUser) {
    if(targetUser){
        const token = await generateToken(targetUser)
        if(token !== undefined){
            const condition = {
                _id: targetUser._id
            }
            try{
                const updated = await user.findByIdAndUpdate(condition, { token }, { new: true })
                if(updated && updated._doc){
                    return updated._doc
                }
            }
            catch(error){
                console.log(error)
            } 
        }
    }
}

async function handleTokenExist(targetUser) {
    if(targetUser &&  targetUser.token){
        const token = await decode(targetUser.token)
        if(token && token.exp){
            const now = new Date().getTime()
            if(token.exp <= now){
                return await updateToken(targetUser)
            }
            return targetUser
        }
    }
}

function sendFinalRespond(res, user) {
    if(user !== undefined){
        response(res, 200, {}, {}, filter(user, noneHidden))
    }
    else{
        response(res, 500, {}, serverError, {})
    }
}

async function loginHandler(req, res) {
    const { email, password } = req.body
    if(email && password){
        const { error, document } = await getOne(["email"], [email.trim()], user, [])
        if(error === true){
            response(res, 500, {}, serverError, {})
        }
        else if(!document){
            response(res, 400, {}, clientError, {})
        }
        else{
            const passwordMatch =  await doesMatch(password, document.password)
            if(passwordMatch === undefined){
                response(res, 500, {}, serverError, {})
            }
            else if(passwordMatch === false){
                response(res, 400, {}, clientError, {})
            }
            else{
                if(document.token && document.token.trim().length>0){
                    const targetUser = await handleTokenExist(document)
                    sendFinalRespond(res, targetUser)
                }
                else{
                    const updatedUser = await updateToken(document)
                    sendFinalRespond(res, updatedUser)
                }

            }
        }
    }
    else{
        response(res, 400, {}, incomplete, {})
    }
}


module.exports = loginHandler