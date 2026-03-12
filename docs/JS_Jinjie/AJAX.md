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
                this.#handlers.forEach(onFulfilled => onFulfilled(this.result))
            }
            
        }
        const reject = (reason) => {
            if(this.state === PENDING){
                this.state = REJECTED
                this.result = reason
                // 异步情况下调用所有rejected回调函数
                this.#handlers.forEach(onRejected => onRejected(this.result))
            }
        }

        // 执行回调函数 这个回调函数是被立即执行的
        excutor(resolve, reject);
    }

    //添加then方法
    then(onFulfilled, onRejected){
        //参数校验  如果用户没有传递回调函数，我们就使用默认的函数（文档中要求）
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
        onRejected = typeof onRejected === 'function' ? onRejected : (reason) => throw reason

        if(this.state === FULFILLED){
            onFulfilled(this.result)
        }else if(this.state === REJECTED){
            onRejected(this.result)
        }else if(this.state === PENDING){
            // 异步情况下，将回调函数添加到队列中.支持了多次调用
            this.#handlers.push({onFulfilled, onRejected})
        }
    }
} 
```
