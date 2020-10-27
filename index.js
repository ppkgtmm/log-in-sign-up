const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.json([
    {
        name: "Bob",
        email: "bob@gmail.com"
    },
    { 
        name: "Sarah",
        email: "sarah@hotmail.com"
    },
    {
        name: "Andy",
        email: "andy@yahoo.com"
    },
    {
      name: "James",
      email: "james@msn.co.uk"
    }])
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})