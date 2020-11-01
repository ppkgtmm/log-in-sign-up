const express = require("express")
const signupHandler = require("../handlers/signup")
const loginHandler = require("../handlers/login")
const router = express.Router()

router.post("/login/", loginHandler)

router.post("/signup/", signupHandler)

router.all("*", (req, res) => {
    res.status(404).json({
        error: "unknown path specified"
    })
})

module.exports = router