//手写new
function myNew(constructor, ...args){
    //if(typeof constructor !== 'function') throw new TypeError('constructor must be func')

    const p = Object.create(constructor.prototype)
    const result = constructor.apply(p, args)

    if((typeof result === 'object' && result !== null) || typeof result ==='function'){
        return result
    }
    
    return p
}

function Person(age, name){
    this.age = age
    this.name = name
}

const p = myNew(1, 18, 'Alice')
console.log(p.name, p.age)




