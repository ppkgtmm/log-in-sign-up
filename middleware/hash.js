const bcrypt = require('bcrypt')

async function hash(data, saltRounds) {
    try{
        hash = await bcrypt.hash(data, saltRounds)
        return hash
    }
    catch(error){
        console.log(error)
    }
}

module.exports = hash