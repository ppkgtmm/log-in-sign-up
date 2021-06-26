function filter(object, wanted) {
    const result = {}
    wanted.forEach((key) => {
        if (object[key]) {
            result[key] = object[key]
        }
    })
    return result
}

function keyExist(object, key) {
    if (object && object[key]) {
        return true
    }
    if (object) {
        return false
    }
}

function containOnlyWantedKeys(object, keyList) {
    if (Object.keys(object).length !== keyList.length) {
        return false
    }
    const keys = Object.keys(object).filter((key) => !keyList.includes(key))
    return keys.length === 0
}

module.exports = { filter, keyExist, containOnlyWantedKeys }
