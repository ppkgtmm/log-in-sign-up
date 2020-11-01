const express = require("express")
const cookieParser = require("cookie-parser")
const connect = require("./database/database")
const home = require("./routes/index")
const router = require("./routes/api")


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

connect()

app.use("/", home)

app.use("/v1",router)

app.use((req, res) => {
    res.status(404).json({
        error: "unknown path specified"
    })
})

const server = app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

module.exports = server