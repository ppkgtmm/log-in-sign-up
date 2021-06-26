const mongoose = require('mongoose')

function connect() {
    const url = process.env.DB_URL
    mongoose.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (error) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Connected to database')
            }
        },
    )
}
module.exports = connect
