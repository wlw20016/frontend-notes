Promise.myAllSettled = function(promises){
    return new Promise((resolve, reject)=>{
        const result = []
        let count = 0
        const len = promises.length

        // 3. 边界情况：空数组直接 resolve
        if (total === 0) {
            resolve(result);
            return;
        }
        promises.forEatch((promise, index)=>{
            Promise.resolve(promise).then(
                res => {
                    result[index] = res
                    count++
                    if(count === len){
                        resolve(result)
                    }
                },
                err =>{
                    result[index] = err
                    count++
                    if(count === len){
                        resolve(result)
                    }
                }   
            )
        })
    })
}