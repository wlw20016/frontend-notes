在 JavaScript 中，`new` 关键字的主要作用是**创建一个用户定义的对象类型的实例**或**具有构造函数的内置对象的实例**。

简单来说，当你使用 `new` 调用一个函数时，JavaScript 引擎在底层默默地为你执行了 4 个关键步骤。

### `new` 的执行过程（四大步骤）

1. **创建一个全新的空对象**：
   在内存中开辟一块新空间，创建一个普通的 JavaScript 空对象（`{}`）。
2. **链接原型（绑定 `__proto__`）**：
   将这个新对象的隐式原型（`__proto__`）指向构造函数的显式原型（`prototype`）。这一步是实现原型链继承的关键，让新对象能够访问构造函数原型上的属性和方法。
3. **绑定 `this` 并执行构造函数**：
   将构造函数内部的 `this` 绑定到刚才创建的新对象上，然后执行构造函数内部的代码（通常是给这个新对象添加属性）。
4. **返回新对象**：
   检查构造函数的返回值。
   * 如果构造函数显式返回了一个**对象**（或函数），那么 `new` 表达式最终返回这个显式返回的对象。
   * 如果构造函数没有返回值，或者返回的是一个**基本数据类型**（如 `123`, `"hello"`, `undefined` 等），那么 `new` 表达式会自动返回刚才创建的那个新对象。

---

### 手写实现一个 `new`

为了更直观地理解，我们可以自己写一个函数 `myNew` 来模拟 `new` 的行为，这是前端面试中非常经典的一道题：

```javascript
function myNew(constructor, ...args) {
  // 1. 拦截非函数的调用
  if (typeof constructor !== 'function') {
    throw new TypeError('constructor must be a function')
  }

  // 2. 创建一个新对象，并将该对象的隐式原型（__proto__）链接到构造函数的显式原型（prototype）
  // Object.create() 是最优雅的做法，它直接完成了步骤 1 和 2
  const obj = Object.create(constructor.prototype)

  // 3. 将 this 绑定到新对象上，并执行构造函数，接收返回值
  const result = constructor.apply(obj, args)

  // 4. 判断返回值类型。如果是对象或函数，就返回它；否则返回我们创建的新对象 obj
  if(typeof result === 'object' || typeof result === 'function'){
    return result
  }
  
  return  obj
}
```

**测试一下我们的 `myNew`：**

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I am ${this.name}`);
};

// 使用原生的 new
const p1 = new Person('Alice', 25);
p1.sayHello(); // 输出: Hello, I am Alice

// 使用我们自定义的 myNew
const p2 = myNew(Person, 'Bob', 30);
p2.sayHello(); // 输出: Hello, I am Bob
```

### 关键点总结

* `new` 的本质就是一个语法糖，帮我们把**对象创建**、**原型链接**和**属性初始化**这三个动作封装在了一起。
* 构造函数尽量不要显式地 `return` 对象，否则会破坏 `new` 实例化的预期行为。只有在特殊场景下才有需求

***

