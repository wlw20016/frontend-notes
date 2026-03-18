在 JavaScript 中，`instanceof` 运算符的核心原理是**原型链查找**。

简单来说，`instanceof` 用于检测**右侧构造函数的 `prototype`（显式原型）属性，是否出现在左侧实例对象的原型链上**。



下面我们来详细拆解它的运作机制和底层实现。

### 一、 核心执行步骤

当你执行 `object instanceof Constructor` 时，JavaScript 引擎在底层实际上做了以下几步：

1. **获取右操作数的原型**：拿到 `Constructor.prototype`。
2. **获取左操作数的原型**：拿到 `object` 的隐式原型，即 `object.__proto__`（在现代 JS 中推荐使用 `Object.getPrototypeOf(object)`）。
3. **比对与遍历**：
   * 将这两者进行比对。如果相等，就返回 `true`。
   * 如果不相等，就顺着左操作数的原型链继续往上找，也就是去找原型的原型（`proto = Object.getPrototypeOf(proto)`），然后再次比对。
4. **终点判断**：如果一直往上找，直到原型链的尽头（`null`）都没有找到相等的原型，则返回 `false`。

---

### 二、 手写实现 `instanceof`

通过自己实现一个 `instanceof` 函数，能最直观地理解它的底层原理：

```javascript
function myInstanceof(left, right) {
    // 1. 拦截基础数据类型（instanceof 无法判断基础数据类型，直接返回 false）
    if (typeof left !== 'object' || left === null) {
        return false;
    }
    
    // 2. 检查右侧操作数是否合法（必须是对象且有 prototype）
    if (typeof right !== 'function') {
        throw new TypeError("Right-hand side of 'instanceof' is not callable");
    }

    // 3. 获取右边构造函数的显式原型
    let prototype = right.prototype;
    
    // 4. 获取左边实例对象的隐式原型
    let proto = Object.getPrototypeOf(left); // 等价于 left.__proto__

    // 5. 顺着原型链不断向上查找
    while (true) {
        // 查找到原型链尽头（Object.prototype.__proto__ 为 null）
        if (proto === null) {
            return false;
        }
        // 找到了匹配的原型
        if (proto === prototype) {
            return true;
        }
        // 没找到，继续向上层原型链查找
        proto = Object.getPrototypeOf(proto);
    }
}

// 测试一下：
console.log(myInstanceof([], Array)); // true
console.log(myInstanceof({}, Object)); // true
console.log(myInstanceof(function(){}, Object)); // true
console.log(myInstanceof(123, Number)); // false (基本类型返回 false)
```

---

### 三、 两个特殊的注意点

#### 1. 基本数据类型的陷阱
`instanceof` **不能**用来正确判断字面量创建的基本数据类型。
```javascript
let str = "hello";
let strObj = new String("hello");

console.log(str instanceof String); // false
console.log(strObj instanceof String); // true
```
由于 `str` 是基本类型，不是对象，没有原型链，所以直接返回 `false`。

#### 2. ES6 的自定义行为：`Symbol.hasInstance`
在 ES6 中，JavaScript 允许我们改变 `instanceof` 的默认行为。如果右侧的类（或构造函数）部署了 `[Symbol.hasInstance]` 方法，那么 `instanceof` 运算符就会调用这个方法，而不是去走传统的原型链查找。

```javascript
class MyClass {
  static [Symbol.hasInstance](instance) {
    // 强行规定：只要是数组，就是 MyClass 的实例
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyClass); // true
console.log({} instanceof MyClass); // false
```

---
