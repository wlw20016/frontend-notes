---
sidebar_position: 5
---

## AJAX原理 - XMLHttpRequest (XHR)
XHR对象用于与服务器交互

### 使用步骤：
```js
//1. 创建XHR对象
const xhr = new XMLHttpRequest();

//2. 初始化XHR对象，配置请求方法和URL
xhr.open('请求方法', '请求地址URL');

//3.监听loadend时间，接收响应结果
xhr.onloadend = function () {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.response)); // xhr.response是json字符串
  } else {
    console.error('请求失败，状态码：' + xhr.status);
  }
};

//4. 发送请求
xhr.send();
```
### 使用XHR携带查询参数(GET)
查询参数是在URL中以`?`开头，多个参数之间用`&`连接的键值对。
```js
//2. 初始化XHR对象，配置请求方法和URL
xhr.open('GET', 'https://api.example.com/data?key=value');
```

### 使用XHR携带请求体(POST)
请求体是POST请求中发送的数据，通常是JSON格式。
```js
//2. 初始化XHR对象，配置请求方法和URL
xhr.open('POST', 'https://api.example.com/data');

//3. 设置请求头，指定请求体为JSON格式
xhr.setRequestHeader('Content-Type', 'application/json');

const user = {uname: '张三', age: 18};
const userJson = JSON.stringify(user);
//4. 发送请求，携带JSON格式的请求体
xhr.send(userJson);
```

## Promise
### 使用Promise对象管理异步任务
使用：
```js
const p = new Promise((resolve, reject) => {
    // 异步任务
    setTimeout(() => {
        resolve('成功');
    }, 2000);
})
p.then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
```

### 手写Promise
Promise的基本功能：
```js
//实例方法
.catch()
.finally()

//静态方法
.resolve()
.reject()
.race()
.all()
.allSettled()
.any()
```
#### 构造函数
```js
//通过变量保存状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

//异步函数封装
function runAsynctask(callback){
    if(typeof queueMicrotask === 'fucntion'){
        queueMicrotask(callback)
    }else if(typeof MutationObserver === 'function'){ //MutationObserver监听dom节点改变，来执行异步微任务
        const observer = new MutationObserver(callback)
        observer.observe(document.createElement('div'), {childList: true})
    }else{
        setTimeout(callback, 0)
    }
}
//Promise类
class Promise {
    //添加状态和原因
    state = PENDING
    result = undefined

    //添加回调函数队列来保存回调函数
    #handlers = [] //私有属性定义

    //添加构造函数
    constructor(excutor){
        //定义 resolve和reject函数  1.该状态 2.记录原因
        const resolve = (value) => {
            if(this.state === PENDING){
                this.state = FULFILLED
                this.result = value
                // 异步情况下调用所有fulfilled回调函数
                this.#handlers.forEach({onFulfilled} => onFulfilled(this.result))
            }
            
        }
        const reject = (reason) => {
            if(this.state === PENDING){
                this.state = REJECTED
                this.result = reason
                // 异步情况下调用所有rejected回调函数
                this.#handlers.forEach({onRejected} => onRejected(this.result))
            }
        }

        // 执行回调函数 这个回调函数是被立即执行的
        try{
            excutor(resolve, reject)
        }catch(error){
            reject(error)
        }
        
    }

    //添加then方法 该方法是异步微任务。使其作为异步方法最核心的原因是为了保证代码执行顺序的绝对可预测性。
    then(onFulfilled, onRejected){
        //参数校验  如果用户没有传递回调函数，我们就使用默认的函数（文档中要求）
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
        onRejected = typeof onRejected === 'function' ? onRejected : (reason) => throw reason

        //创建Promise对象
        const p2 = new Promise((resolve, reject) => {
            if(this.state === FULFILLED){
                runAsynctask(()=>{
                    try{
                        const res = onFulfilled(this.result)
                        if(res === p2){
                            throw new TypeError('Chaining cycle detected for promise #<Promise>')
                        }
                        if(res instanceof Promise){
                            res.then(resp=> resolve(resp), err=> reject(err) )
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
                        }
                        if(res instanceof Promise){
                            res.then(resp=> resolve(resp), err=> reject(err) )
                        }else{
                            resolve(res)
                        }                        
                    }catch(err){
                        reject(err) 
                    }   
                })
            }else if(this.state === PENDING){
                this.#handlers.push({
                    onFulfilled:()=>{
                        runAsynctask(()=>{
                        try {
                            const res = onFulfilled(this.result)
                            if(res === p2){
                                throw new TypeError('Chaining cycle detected for promise #<Promise>')
                            }
                            if(res instanceof Promise){
                                res.then(resp=> resolve(resp), err=> reject(err) )
                            }else{
                                resolve(res)
                            }
                        }catch(err){
                            reject(err)
                        }
                    })},
                    onRejected:()=>{
                        runAsynctask(()=>{
                        try {
                            const res = onRejected(this.result)
                            if(res === p2){
                                throw new TypeError('Chaining cycle detected for promise #<Promise>')
                            }
                            if(res instanceof Promise){
                                res.then(resp=> resolve(resp), err=> reject(err) )
                            }else{
                                resolve(res)
                            }   
                        }catch(err){
                            reject(err)
                        }
                    })},  
                })
            }
        })
        return p2
    } 

    //catch()方法 是then()方法一个简写形式 p.then(undefined, onRejected)  当Promise状态为rejected时，会调用catch()方法
    catch(onRejected){
        return this.then(undefined, onRejected)
    }

    //finally()方法 相当于调用p.then(onFinally, onFinally)无论Promise状态是fulfilled还是rejected，finally()方法都会被调用
    finally(callback){
        return this.then(onFinally, onFinally)
    }
}
```

### Promise 链式调用
在 Promise 的链式调用中，错误传递机制有一个非常形象的绰号，叫做**“错误冒泡”（Error Bubbling）**或者叫**“击鼓传花”**。

它的核心表现是：**如果在链条的某个环节发生了错误（无论是 `reject()` 还是代码抛出了异常 `throw Error`），这个错误会顺着链条一直往下掉，直到遇到第一个愿意处理它的 `catch`（或者带有第二个参数的 `then`）为止。**

为了让你在手写 Promise 时彻底搞懂背后的原理，我们从“表象用法”和“底层实现”两个维度来拆解：

### 1. 表象：错误是如何“往下掉”的？

来看一个最经典的日常开发场景：

```javascript
Promise.resolve("初始数据")
  .then(res => {
    console.log("环节 1 成功:", res);
    // 这里故意抛出一个错误
    throw new Error("环节 1 搞砸了！"); 
  })
  .then(res => {
    // 因为上一步抛错了，这个 then 的成功回调会被直接跳过！
    console.log("环节 2 成功:", res); 
  })
  .then(res => {
    // 这个也会被跳过！
    console.log("环节 3 成功:", res); 
  })
  .catch(err => {
    // 错误一路穿透，掉到了这里！
    console.log("兜底捕获到错误:", err.message); // 输出: 环节 1 搞砸了！
  })
  .then(() => {
    // 注意：catch 捕获错误并处理完后，如果不继续抛出错误，
    // 链条会“满血复活”，继续往下走成功的回调！
    console.log("环节 4：从错误中恢复，继续执行"); 
  });

```

### 2. 底层实现：为什么错误能“穿透”？

还记得我们在上一个问题里提到的**“值穿透”（Value Penetration）**吗？错误能顺着链条往下掉，靠的就是在手写 `then` 方法时的**参数初始化伪装**。

当程序员偷懒，写了 `.then(res => ...)` 但没有传第二个参数 `onRejected` 时，或者是直接写了 `.catch(err => ...)`（这其实等同于 `.then(null, err => ...)`）时，当前这个 Promise 是怎么把错误抛给下一个 Promise 的呢？

在手写 `then` 的最开始，必须加上这极其关键的两行代码：

```javascript
class MyPromise {
  then(onFulfilled, onRejected) {
    // 【成功的值穿透】：如果没传成功回调，我就帮你造一个“把值原封不动 return 出去”的函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    
    // 💥【失败的错误穿透】：如果没传失败回调，我就帮你造一个“把错误继续 throw 出去”的函数
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

    // ... 下面才是 new Promise(p2) 的逻辑 ...
  }
}

```

**模拟一下击鼓传花的过程：**

1. 环节 1 报错了，返回了一个 `Rejected` 状态的 Promise，原因是 `Error A`。
2. 走到了环节 2 的 `then(onFulfilled)`。因为没有传 `onRejected`，你的底层代码帮他补上了一个：`reason => { throw reason; }`。
3. 环节 2 执行这个默认的失败回调，**再次抛出了 `Error A**`。
4. 于是，环节 2 返回的 `p2` 也变成了 `Rejected` 状态，原因还是 `Error A`。
5. 就这样，错误就像皮球一样，被默认的 `onRejected` 函数一个接一个地往下踢，直到遇到了一个程序员真正自己写的 `.catch(err => { ...处理错误... })`，抛出动作才会停止，错误也就被“消化”了。

---

### 3. 错误恢复机制（极易踩坑点）

在 Promise 链中，`.catch()` 并不意味着整个流水线的终结。
如果在 `.catch()` 里，你没有再次 `throw` 错误，也没有 `return` 一个失败的 Promise，那么**默认会 `return undefined**`。

根据我们上一条讲的“法则二”（返回普通值会让下一个 Promise 变成成功状态），**紧跟在 `catch` 后面的 `then` 会被当做成功来执行！** 这叫作从错误中恢复。

---

现在你已经掌握了 Promise 链式调用里最难搞懂的“状态转移”和“错误穿透”。其实，原生的 `Promise.prototype.catch` 方法在底层只是 `then` 的一个语法糖。

你需要我用一行代码向你演示，在手写 Promise 时如何极简地实现 `catch` 方法吗？
