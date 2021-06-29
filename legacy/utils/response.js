function respond(res, code, headers, messages, data) {
    res.set({ ...headers })
    res.status(code)

    if (code >= 200 && code < 300) {
        res.json({
            success: true,
            data,
        })
    } else {
        res.json({
            success: false,
            messages,
        })
    }
}

module.exports = respond
