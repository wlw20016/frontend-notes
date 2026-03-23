Promise.myReject = function(promise){
    if(promise instanceof Promise){
        return promise
    }

    return new Promise((undefined, reject) => {
        reject(promise)
    })
}