# JS中怎么删除数组最后一个元素
## 方法1 pop()
```js
//pop()方法会直接修改原数组，返回的是被删除的元素。pop处理空数组时，返回的是undefined
let fruits = ['apple', 'banana', 'orange'];
let lastFruit = fruits.pop();
console.log(lastFruit); // 输出: 'orange'
console.log(fruits); // 输出: ['apple', 'banana']
```
## 方法2 splice()
```js
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
//splice()方法会直接修改原数组，返回的是删除的元素数组
// 参数详解
//start ： 开始修改的索引位置。负数表示从末尾倒数。
//deleteCount ： 要删除的元素个数。为 0 或负数则不删除
//item1, ... ： 要插入到数组中的新元素。

//返回值：一个包含被删除元素的新数组。如果没有删除任何元素，则返回空数组 []
```

```js
//splice()方法会直接修改原数组，返回的是删除的元素数组
let fruits = ['apple', 'banana', 'orange'];
let removedFruits = fruits.splice(-1, 1);
console.log(removedFruits); // 输出: ['orange']
console.log(fruits); // 输出: ['apple', 'banana']
```
## 方法3 slice()
```js
arr.slice([start[, end]])
//slice()方法不会直接修改原数组，返回的是删除的元素数组
//参数说明
//start : 开始截取的位置（包含）。负数表示从末尾倒数。
//end : 结束截取的位置（不包含）。负数表示从末尾倒数。

//返回值 ：一个包含被截取元素的新数组。
```
```js
let fruits = ['apple', 'banana', 'orange'];
let newFruits = fruits.slice(0, -1); //截取从[0-2) 即，截取0,1这两个元素
console.log(newFruits); // 输出: ['apple', 'banana']
console.log(fruits); // 输出: ['apple', 'banana', 'orange']

```