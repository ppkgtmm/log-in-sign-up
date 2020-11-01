function filter(object, wanted) {
    const result = {}
    wanted.forEach((key) => {
        if(object[key]){
            result[key] = object[key]
        }
    })
    return result
}

function keyExist(object, key) {
    if(object && object[key]){
        return true
    }
    else if(object){
        return false
    }
}
module.exports = { filter, keyExist }