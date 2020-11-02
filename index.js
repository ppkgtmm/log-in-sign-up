const express = require("express")
const cookieParser = require("cookie-parser")
const connect = require("./database/database")
const router = require("./routes/api")


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

connect()


app.use("/",router)


const server = app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

module.exports = server