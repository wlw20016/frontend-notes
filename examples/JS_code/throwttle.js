//手写节流函数
function throwttle(fun, wait){
    let timeID = null
    return function(...args){
        const _this = this
        if(!timeID){
            timeID = setTimeout(()=>{
                fun.apply(_this, args)
                timeID = null
            }, wait)
        }
    }
}

const output = throwttle((args)=>console.log(`被调用了${args}次`), 0)

output(1)
output(2)
output(3)
output(4)