const mongoose = require("mongoose")
const config = require("../config")

function connect() {
    let url = config.DATABASE.DEV
    if(process.env.ENV && process.env.ENV === "PROD"){
        url = config.DATABASE.PROD
    }
    mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(error) {
        if(error){
            console.log(error)
        }
        else{
            console.log("Connected to database")
        }
    })
}
module.exports = connect