function getErrorsMessages(errorObj){
    if(!errorObj || !errorObj.errors){
        return { error: false }
    }

    const error = errorObj.errors
    const fields = Object.keys(error)

    const messages = { }
    fields.forEach(field => {
        if(field && error[field].message){
            messages[field] = error[field].message
        }
    })

    if(Object.keys(messages).length === 0){
        return { error: false }
    }

    return { error: true, messages}
}


function validate(newObject){
    try{
        let errors = newObject.validateSync();
        return getErrorsMessages(errors)
    }
    catch(error){
        console.log(error)
        return
    }
}

module.exports  = validate
