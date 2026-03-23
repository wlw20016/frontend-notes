
function ajaxRequest(configs){
    return new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest()
        xhr.open( configs.method || 'GET', configs.url, configs.data)
        xhr.addEventListener('loadend', ()=>{
            if(xhr.status >=200 && xhr.status < 300){
                resolve(JSON.parse(xhr.response))
            }else{
                reject(new Error(xhr.response))
            }
        })
        if(configs.data){
            xhr.send(configs.data)
        }else{
            xhr.send()
        }
    })
}