
async function getDocument(query){
    const promise = query.exec()
    return await promise.then(document => {
        if(document && document._doc){
            return {
                error: false,
                document: {
                    ...document._doc
                }
            }
        }
        return { error: false }
    }).catch( error => {
        if(error){
            return { error: true }
        }
    })
}

async function handelSelectSome(model, wanted, condition) {
    const columns = wanted.reduce((sum, current) => {
        return `${sum} ${current}`
    }).trim()
    const query  = model.findOne(condition).select(columns)
    return await getDocument(query)
}

async function handleSelectAll(model, condition) {
    const query  = model.findOne(condition)
    return await getDocument(query)
}

async function getOne(fields, values, model, wanted){
    let condition = { }
    if(fields.length !== values.length){
        return { error: true }
    }
    for(i in values){
        condition[fields[i]] = values[i]
    }
    if(wanted && wanted.length>0){
        return await handelSelectSome(model, wanted, condition)
    }
    else{
        return await handleSelectAll(model, condition)
    }
}

async function save(newObject) {
    try{
        const savedUser = await newObject.save()
        if(savedUser && savedUser._doc){
            return {
                error: false,
                _doc: savedUser._doc
            }
        }
        return { error: true }
    }
    catch(error){
        console.log(error)
        return { error: true }
    }
}


module.exports =  {
    getOne, save
} 