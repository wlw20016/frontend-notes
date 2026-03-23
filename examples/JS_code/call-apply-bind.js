//call
Function.prototype.myCall =  function (obj, ...args){
    if(typeof this !== 'function') throw new TypeError('must be a function')
    obj = obj || globalThis
    obj = Object(obj)
    const fnSymble = Symbol('fn')
    obj[fnSymble] = this
    const result = obj[fnSymble](...args)
    delete obj[fnSymble]
    return result
}

//apply
Function.prototype.myApply =  function(obj, args){
    if(typeof this !== 'function') throw new TypeError('must be a function')
    obj = obj || globalThis
    args = args || []
    obj = Object(obj)
    const fnSymble = Symbol('fn')
    obj[fnSymble] = this
    const result = obj[fnSymble](...args)
    delete obj[fnSymble]
    return result
}

//bind
Function.prototype.myBind = function(obj, ...args1){
    const originalFn = this
    const boundFn = function(...args2){
        const totalArgs = [...args1, ...args2]
        if(this instanceof boundFn){
            return new originalFn(...totalArgs)
        }
        return originalFn.call(obj, ...args1, ...args2)
    }
    
    if(originalFn.prototype){
        boundFn.prototype = Object.create(originalFn.prototype)
    }    
    return boundFn
}


const obj = {age : 18}
function myAge(){
    console.log(this.age)
}
const fun = myAge.myBind(obj)
fun()