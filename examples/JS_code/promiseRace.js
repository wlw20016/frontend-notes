Promise.myRace = function(promises){
    return new Promise((resolve, reject)=>{
        let result = null
        if(promises.length === 0){
            resolve(result)
        }

        promises.forEatch(promise =>{
            Promise.resolve(promise).then(
                res => {
                    resolve(res)
                },
                err => {
                    reject(err)
                }
            )
        })
    }) 
}