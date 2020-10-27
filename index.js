const express = require('express')
const cookieParser = require('cookie-parser')
const connect = require('./database/database')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

connect()

app.use((req, res, next) => {
  res.status(404).json({
    error: 'unknown path specified'
  })
})

app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})