function validate(newUser){
    let isError = false
    const errorMessages = { }
    let error = newUser.validateSync();
    if(error && error.errors){
        error = error.errors
        fields = Object.keys(error)
        fields.forEach(field => {
            if(field && error[field].message){
                errorMessages[field] = error[field].message
                isError = true
            }
        })
    }
    return {
        error: isError,
        messages: errorMessages
    }
}

module.exports  = validate
