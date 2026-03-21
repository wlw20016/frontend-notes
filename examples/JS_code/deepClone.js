//手写递归深拷贝
function deepClone(obj, hash = new WeakMap()){
    //1. 判断是否为DOM节点以及环境支持，若是，则返回克隆的DOM节点
    if(obj.nodeType && typeof obj.cloneNode === 'function'){
        return obj.cloneNode(true)
    }
    //2. 如果不是Object 或者为null
    if(obj === null || typeof obj !== 'object'){
        return obj
    }
    //3.如果是特殊对象类型Date， RegExp
    if(obj instanceof Date) return new Date(obj)
    if(obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
    
    //4.处理循环引用
    if(hash.has(obj)){
        return hash.get(obj)
    }

    //5.初始化克隆目标
    const cloneObj = new obj.constructor()

    //6.加入映射
    hash.set(obj, cloneObj)

    //7.递归调用
    Reflect.ownKeys(obj).forEach(key =>{
        cloneObj[key] = deepClone(obj[key], hash)
    })

    return cloneObj
}

//JSON深拷贝
JSON.parse(JSON.stringify(obj))

//lodsh的深拷贝函数
import _ from 'lodash'
_.cloneDeep()