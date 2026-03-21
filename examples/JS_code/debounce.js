//手写防抖函数
//要实现的是，无论怎么调用这个函数，都只执行最后一次调用
function func(){
    console.log("被调用了")
}

function debounce(fun, wait, immediate){
    let timeID = null
    return function(...args){
        const _this = this
        if(timeID) clearTimeout(timeID)
        if(immediate){
            const now = !timeID
            timeID = setTimeout(()=>{
                timeID = null
            }, wait)
            if(now){
                fun.apply(_this, args)
            }
        }else{
            timeID = setTimeout(()=>{
                fun.apply(_this, args)
            }, wait)
        }
    }
}

const output = debounce(func, 2000, false)
output()
output()
output()
output()
output()
output()
output()
output()
output()
output()
output()