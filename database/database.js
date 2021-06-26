const mongoose = require("mongoose")
const config = require("../config")

function connect() {
    let url = process.env.DB_URL
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