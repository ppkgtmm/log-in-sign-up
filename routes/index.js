const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json({
      message: "sign in or sign up ?"
    })
});

module.exports = router