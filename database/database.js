const mongoose = require('mongoose')
const config = require('../config')

function connect() {
    mongoose.connect(config.DATABASE,{ useNewUrlParser: true, useUnifiedTopology: true }, function(error) {
        if(error){
            console.log(error)
        }
        else{
            console.log('Connected to database')
        }
    })
}

module.exports = connect