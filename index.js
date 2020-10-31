const express = require("express")
const cookieParser = require("cookie-parser")
const connect = require("./database/database")
const home = require("./routes/index")
const signup = require("./routes/signup")
const login = require("./routes/login")


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

connect()

app.use("/", home)

app.use("/v1",signup)
app.use("/v1",login)

app.use((req, res) => {
	res.status(404).json({
		error: "unknown path specified"
	})
})

app.listen(port, () => {
	console.log(`listening on port: ${port}`)
})