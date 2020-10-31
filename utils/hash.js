const bcrypt = require("bcrypt")

async function hash(data, saltRounds) {
    try{
        return await bcrypt.hash(data, saltRounds)
    }
    catch(error){
        console.log(error)
    }
}

async function doesMatch(password, hash) {
    try{
        return await bcrypt.compare(password, hash)
    }
    catch(error){
        console.log(error)
    }
}
module.exports = { hash, doesMatch }