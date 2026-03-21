const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function runAsynctask(callback){
    if(typeof queueMicrotask === 'function'){
        queueMicrotask(callback)
    }else{
        setTimeout(callback, 0)
    }
}

class myPromise{
    state = PENDING
    result = null

    #handles = []
    //构造函数
    constructor(excutor){
        //resolve函数的this 是要指向新创建的promise实例的
        const resolve = (res) => {
            // 核心新增：如果 resolve 接收的是一个 Promise，要等待它决议！
            if (res instanceof myPromise) {
                return res.then(resolve, reject);
            }
            // console.log(this) 
            if(this.state === PENDING){
                this.state = FULFILLED
                this.result = res
                this.#handles.forEach(({onFulfilled}) => onFulfilled())
            }
        }
        const reject = (err) => {
            if(this.state === PENDING){
                this.state = REJECTED
                this.result = err
                this.#handles.forEach(({onRejected}) => onRejected())
            }
        }
        try{
            excutor(resolve, reject) 
            //在new新的 promise的时候，new内部会执行constructor.apply(obj, args)构造函数将其this指向新创建的实例对象。
            //在构造函数内部，执行的excutor()是单独调用，其this指向的是window（在非严格模式下）
        }catch(err){
            throw err
        }
    }

    //then函数
    then(onFulfilled, onRejected){
        onFulfilled = onFulfilled instanceof Function ? onFulfilled : x => x
        onRejected = onRejected instanceof Function ? onRejected : x => {throw x}
        //then()的this指向调用它的实例 p
        //这里创建p2时，传入的是箭头函数，箭头函数的this指向根据词法环境确定。该箭头函数的外层是this，所以它的this也就指向了p
        const p2 = new Promise((resolve, reject)=>{
            if(this.state === FULFILLED){
                runAsynctask(()=>{
                    try{
                        const res = onFulfilled(this.result)
                        if(res === p2){
                            throw new TypeError('Chaining cycle detected for promise #<Promise>') 
                        }else if(res instanceof myPromise){
                            res.then(resp => resolve(resp), err => reject(err))
                        }else{
                            resolve(res)
                        }
                    }catch(err){
                        reject(err)
                    }
                })
            }else if(this.state === REJECTED){
                runAsynctask(()=>{
                    try{
                        const res = onRejected(this.result)
                        if(res === p2){
                            throw new TypeError('Chaining cycle detected for promise #<Promise>') 
                        }else if(res instanceof myPromise){
                            res.then(resp => resolve(resp), err => reject(err))
                        }else{
                            resolve(res)
                        }
                    }catch(err){
                        reject(err)
                    }
                })
            }else{
                this.#handles.push({
                    onFulfilled : ()=>{
                        runAsynctask(()=>{
                            try{
                                const res = onFulfilled(this.result)
                                if(res === p2){
                                    throw new TypeError('Chaining cycle detected for promise #<Promise>') 
                                }else if(res instanceof myPromise){
                                    res.then(resp => resolve(resp), err => reject(err))
                                }else{
                                    resolve(res)
                                }
                            }catch(err){
                                reject(err)
                            }
                        })
                    },
                    onRejected : ()=>{
                        runAsynctask(()=>{
                             try{
                                const res = onRejected(this.result)
                                if(res === p2){
                                    throw new TypeError('Chaining cycle detected for promise #<Promise>') 
                                }else if(res instanceof myPromise){
                                    res.then(resp => resolve(resp), err => reject(err))
                                }else{
                                    resolve(res)
                                }
                            }catch(err){
                                reject(err)
                            }
                        })
                    }
                })
            }

        })
        return p2
    }
}

//Promise 链式调用例子

console.log('1. [同步] 脚本开始执行');

// 模拟一个初始的异步请求（比如：获取用户信息）
const fetchUser = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('2. [异步宏任务] fetchUser 请求完毕');
        resolve({ id: 101, name: 'Alice' });
    }, 1000);
});

fetchUser
    .then(user => {
        console.log('3. [微任务] 拿到用户：', user.name);
        // 【关键点 1】这里 return 了一个全新的 Promise（对应你手写源码里的 res instanceof myPromise）
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('4. [异步宏任务] 尝试获取用户的文章列表...');
                // 模拟接口报错
                reject(new Error('文章接口 500 崩溃啦')); 
            }, 500);
        });
    })
    .then(posts => {
        // 【关键点 2】由于上一步 reject 了，这个 then 会被直接跳过！
        console.log('5. [微任务] 拿到文章：', posts);
        return '文章处理完毕';
    })
    .catch(err => {
        // 【关键点 3】捕获到第 4 步抛出的错误。
        console.error('6. [微任务] 触发拦截：', err.message);
        // 【关键点 4：错误恢复】catch 也是 then 的语法糖，它 return 正常值时，会返回一个 FULFILLED 的新 Promise！
        return { fallback: true, defaultPosts: ['新人指南'] }; 
    })
    .then(result => {
        // 【关键点 5】因为上一步的 catch 成功“兜底”并 return 了值，链条恢复正常，这里会被执行！
        console.log('7. [微任务] 从错误中恢复，继续执行。拿到兜底数据：', result);
        // 突然又抛出一个同步错误
        throw new Error('本地处理数据时由于未知原因崩溃'); 
    })
    .finally(() => {
        // 【关键点 6】无论前面是成功还是失败，finally 都会执行。但它不会改变数据流。
        console.log('8. [微任务] Finally: 关闭全局 Loading 动画');
    })
    .catch(err => {
        // 【关键点 7】捕获第 7 步抛出的同步错误
        console.error('9. [微任务] 最终防线捕获：', err.message);
    });

console.log('10. [同步] 脚本主线程走完');