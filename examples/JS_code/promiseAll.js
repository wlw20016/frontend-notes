

Promise.myAll = function(promises){
    
    return new Promise((resolve, reject)=>{

        if(!Array.isArray(promises)){
            return new TypeError('must be a array')
        }
    
        const result = []
        const count = 0

        // 3. 边界情况：如果传进来的是个空数组，直接 resolve() 掉
        if (promises.length === 0) {
            resolve(result)
            return
        }
    
        promises.forEatch((promise, index) => {
            Promise.resolve(promise).then(
                    res => {
                        result[index] = res
                        count++
                        if(count === promises.length){
                            resolve(result)
                        }
                    },
                    err => {
                        reject(err)
                    }
            )
        })

    })
    
}