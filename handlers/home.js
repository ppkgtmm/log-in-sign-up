function handleHomePage(req, res) {
    res.status(200).json({
        messages: "Welcome to sign in / sign up"
    })
}

module.exports = handleHomePage