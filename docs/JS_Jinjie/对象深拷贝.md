---
sidebar_position: 11
---

在 JavaScript 中实现对象的深拷贝（Deep Copy）有几种常见的方法，具体选择哪种取决于你的项目环境以及对象的复杂程度。

以下是主流的四种实现方式，按推荐程度和适用场景排列：

### 1. 现代原生方法：`structuredClone()` （首选推荐）
这是目前现代浏览器和 Node.js 原生支持的最标准、最高效的深拷贝方法。

**优点**：
* 原生支持，性能好。
* 能完美处理循环引用（Circular references）。
* 支持多种内置类型：`Date`、`Set`、`Map`、`RegExp`、`ArrayBuffer` 等。

**缺点**：
* **不支持拷贝函数（Functions）**，遇到函数会报错。
* 不支持拷贝 DOM 节点。
* 会丢失对象的原型链（原型变成 `Object`）。

```javascript
const original = { name: "Gemini", date: new Date(), map: new Map() };
original.self = original; // 循环引用

// 完美拷贝
const clone = structuredClone(original);
```

---

### 2. 经典捷径：`JSON.parse(JSON.stringify(obj))`
这是过去最常用的“黑魔法”，适用于非常简单、纯粹的数据对象（JSON-safe）。

**优点**：
* 代码极其简短，兼容性极好。

**缺点（非常多）**：
* **会忽略**：`undefined`、`Symbol`、函数（Functions）。
* **会变形**：`Date` 对象会被转换成字符串，`RegExp`、`Error` 会变成空对象 `{}`，`NaN`、`Infinity` 会变成 `null`。
* **会报错**：如果对象存在循环引用，直接抛出异常。

```javascript
const original = { a: 1, b: "text", c: [1, 2, 3] };
const clone = JSON.parse(JSON.stringify(original));
```

---

### 3. 生产环境利器：第三方库 `lodash.cloneDeep`
如果在企业级项目中，且对象结构非常复杂，直接引入成熟的工具库是最稳妥的做法。

**优点**：
* 极其健壮，几乎考虑了所有边界情况和数据类型。
* 稳定可靠。

**缺点**：
* 需要引入第三方依赖（如果在意打包体积的话，可以单独引入 `lodash/cloneDeep`）。

```javascript
import cloneDeep from 'lodash/cloneDeep';

const original = { /* 任何复杂的结构 */ };
const clone = cloneDeep(original);
```

---

### 4. 面试常考：手写递归实现
如果不想引入第三方库，又觉得 `structuredClone` 不够用，可以自己写一个递归函数。这也是前端面试中极其高频的考点。

没问题！在前端面试中，如果你能写出一个处理了**循环引用**和**特殊对象**的深拷贝，面试官会对你的 JavaScript 基础功底刮目相看。

这里为你提供一个**高阶版**的手写深拷贝代码。不仅解决了基础版的痛点，我还加入了对 `Symbol` 属性的拷贝支持，让它更加无懈可击。

### 🚀 高阶版深拷贝实现 (完整代码)

你可以直接复制这段代码在浏览器控制台运行测试：

```javascript
function deepClone(target, hash = new WeakMap()) {

    // 判断是否为 DOM 节点 (nodeType 为 1 表示元素节点) target.cloneNode === 'function' 判断环境是否支持
    if (target.nodeType && typeof target.cloneNode === 'function') {
    return target.cloneNode(true); 
    }
  // 1. 处理基本数据类型和 null (直接返回)
  if (target === null || typeof target !== 'object') {
    return target;
  }

  // 2. 处理特殊对象类型 (Date, RegExp 等)
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target.source, target.flags);

  // 3. 处理循环引用：如果该对象已经在 WeakMap 中存在，说明遇到了循环引用，直接返回对应的克隆对象
  if (hash.has(target)) {
    return hash.get(target);
  }

  // 4. 初始化拷贝目标：利用 target.constructor 保留对象的原型 (这样无论是 [] 还是 {} 都能准确创建) 执行到这里，说明target是一个对象，对象被构造函数创造时，会从原型身上继承constructor属性，也就是说对象实例也会通过constructor指向构造函数。所以说 target.constructor就是target的构造函数，new target.constructor() 就是创建了一个新的对象实例，这个实例就会有原型链。
  const cloneTarget = new target.constructor();

  // 5. 立即将当前对象存入 WeakMap，作为“已处理”的标记
  hash.set(target, cloneTarget);

  // 6. 遍历对象的所有 key，包括普通属性和 Symbol 属性进行递归克隆
  // Reflect.ownKeys() 等同于 Object.getOwnPropertyNames() + Object.getOwnPropertySymbols()
  Reflect.ownKeys(target).forEach(key => {
    cloneTarget[key] = deepClone(target[key], hash);
  });

  return cloneTarget;
}
```

---

### 💡 核心考点解析（面试时可以直接这样向面试官解释）：

* **为什么要用 `WeakMap` 来解决循环引用？**
    * 如果对象内部引用了自己（比如 `obj.self = obj`），传统的递归会陷入无限死循环，导致栈溢出（Stack Overflow）。
    * 我们使用 `hash` 表记录**已经拷贝过的对象**。每次拷贝前查一下表，如果存在，直接返回克隆后的结果，从而切断死循环。
    * 使用 `WeakMap` 而不是普通的 `Map`，是因为 `WeakMap` 的键是**弱引用**。当拷贝完成，原始对象不再被需要时，垃圾回收机制（GC）可以自动回收这部分内存，有效防止内存泄漏。
* **`new target.constructor()` 的妙用：**
    * 相比于写 `const clone = Array.isArray(target) ? [] : {}`，`new target.constructor()` 更加优雅。它不仅能自动判断是数组还是对象，还能**保留目标对象的原型链**（Prototype）。
* **`Reflect.ownKeys()` 解决的痛点：**
    * 传统的 `for...in` 循环无法遍历出 `Symbol` 类型的键。使用 `Reflect.ownKeys(target)` 可以一次性拿到所有的常规字符串键和 `Symbol` 键，确保不漏掉任何属性。

---

### 🧪 终极测试用例

你可以用下面这个“变态”的对象来检验这段代码的威力：

```javascript
const sym = Symbol('id');
const obj = {
  num: 1,
  str: "hello",
  bool: true,
  undef: undefined,
  date: new Date(),
  reg: /\d+/gi,
  arr: [1, 2, 3],
  [sym]: "symbol value" // 包含 Symbol 属性
};
// 制造循环引用
obj.loop = obj; 

const clonedObj = deepClone(obj);

console.log('克隆对象:', clonedObj);
console.log('是否全等:', clonedObj === obj); // false (说明是不同的内存地址)
console.log('循环引用是否成功:', clonedObj.loop === clonedObj); // true (完美克隆了循环引用逻辑)
```

掌握了这段代码和背后的原理，你在面对任何关于深拷贝的面试提问时都能游刃有余了。
