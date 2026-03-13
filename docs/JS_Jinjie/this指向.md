---
sidebar_position: 4
---

### 普通函数指向
谁调用，指向谁

### 箭头函数指向
箭头函数的 this 只看它“在哪里被写出来（定义）的”，完全无视它“在哪里被执行的”。
一层一层往上找，直到找到有this定义的
原型对象上添加方法时，不要用箭头函数

## 改变this指向

### call()
call(thisArg, arg1, arg2, ...)方法调用一个函数, 其具有一个指定的this值和分别的参数(参数的列表)。
```js
function test(){
    console.log(this);
}
test.call({a:10}) // {a:10}
```
call()函数的实现
```js

Function.prototype.myCall = function(context, ...args) {
  // 1. 基础校验：确保调用 myCall 的是一个函数
  if (typeof this !== 'function') {
    throw new TypeError('Error: myCall 必须被一个函数调用');
  }
  // 2. 处理 context 边界情况
  // 如果没传 context，或者传了 null/undefined，this 默认指向全局对象 (浏览器里是 window，Node.js 里是 global)
  // 现代 JS 中推荐使用 globalThis 来兼容不同环境
  context = context || globalThis;
  // 如果传入的 context 是基本数据类型（如数字 1，字符串 "abc"），需要用 Object() 包装成对象
  context = Object(context);
  // 3. 创建一个独一无二的属性名，防止覆盖 context 原本可能存在的同名属性
  const fnSymbol = Symbol('fn');
  // 4. 将当前函数（也就是调用 myCall 的那个函数，即 this）作为临时方法添加到 context 上
  context[fnSymbol] = this;
  // 5. 执行这个临时方法，此时函数内部的 this 已经隐式绑定到了 context 上！
  // 传入剩余的参数，并保存执行结果
  const result = context[fnSymbol](...args); //这里，是context在调用函数，所以this指向了context
  // 6. 过河拆桥：执行完毕后，删除这个临时属性，保持传入对象的纯洁
  delete context[fnSymbol];
  // 7. 返回函数执行的结果
  return result;
};
```


### apply()
apply(thisArg, [arg1, arg2, ...])方法调用一个函数, 其具有一个指定的this值，以及作为一个数组（或类数组对象）提供的参数。
```js
function test(){
    console.log(this);
}
test.apply({a:10}) // {a:10}
```
apply()函数的实现
```js
Function.prototype.myApply = function(context, args) {
  // 1. 基础校验：确保调用 myCall 的是一个函数
  if (typeof this !== 'function') {
    throw new TypeError('Error: myCall 必须被一个函数调用');
  }
  // 2. 处理 context 边界情况
  // 如果没传 context，或者传了 null/undefined，this 默认指向全局对象 (浏览器里是 window，Node.js 里是 global)
  // 现代 JS 中推荐使用 globalThis 来兼容不同环境
  context = context || globalThis;
  // 如果传入的 context 是基本数据类型（如数字 1，字符串 "abc"），需要用 Object() 包装成对象
  context = Object(context);
  // 3. 创建一个独一无二的属性名，防止覆盖 context 原本可能存在的同名属性
  const fnSymbol = Symbol('fn');
  // 4. 将当前函数（也就是调用 myCall 的那个函数，即 this）作为临时方法添加到 context 上
  context[fnSymbol] = this;
  // 5. 执行这个临时方法，此时函数内部的 this 已经隐式绑定到了 context 上！
  // 传入剩余的参数，并保存执行结果
  const result = context[fnSymbol](args); //这里，是context在调用函数，所以this指向了context
  // 6. 过河拆桥：执行完毕后，删除这个临时属性，保持传入对象的纯洁
  delete context[fnSymbol];
  // 7. 返回函数执行的结果
  return result;
};
```

### bind()
bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。
```js
function test(){
    console.log(this);
}
const testBind = test.bind({a:10})
testBind() // {a:10}
```
bind()函数的实现
```js
Function.prototype.myBind = function(context, args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error: myBind 必须被一个函数调用');
  }
  const fn = this
  return function (newArgs){
    fn.apply(context, args.concat(newArgs))
  }
```
### 连续多次调用bind函数

greet函数的this 的指向永远由第一次 bind 决定，后续的 bind 无法再修改greet函数的this，但传入的参数会一直叠加
```js
function greet() {
    console.log(this.name);
}

const obj1 = { name: 'Alice' };
const obj2 = { name: 'Bob' };
const obj3 = { name: 'Charlie' };

// 第一次 bind
const bound1 = greet.bind(obj1);  
// bound1 = function (newArgs){
//   return greet.apply(obj1, args.concat(newArgs))  
//   （这里执行以后，greet的this指向了obj1）
// }
bound1(); // 输出: Alice

// 第二次 bind (试图把 this 改成 obj2)
const bound2 = bound1.bind(obj2); 
// bound2 = function (newArgs){
//   return bound1.apply(obj2, args.concat(newArgs))
//   （这里执行以后，bound1的this指向了obj2，但并不会在bound1执行的时候，影响greet.apply(obj1, args.concat(newArgs))的执行，即，在apply内部，通过obj2执行的bound1函数返回的是greet.apply(obj1)的结果，greet的this并没有被改变）
// }
bound2(); // 输出: Alice (依然是 Alice！改不掉了)

// 第三次 bind
const bound3 = bound2.bind(obj3);
// bound3 = function (newArgs){
//   return bound2.apply(obj3, args.concat(newArgs))
//   （这里执行以后，bound2的this指向了obj3）
// }
bound3(); // 输出: Alice
```

  
