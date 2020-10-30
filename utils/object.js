function filter(object, wanted) {
   const result = { }
   wanted.forEach((key) => {
       if(object[key]){
            result[key] = object[key]
       }
   })
   return result
}

module.exports = filter