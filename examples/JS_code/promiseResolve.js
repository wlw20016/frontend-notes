Promise.myResolve = function (value) {
  // 核心考点：如果传进来的值本身就是一个 Promise 实例，直接原样返回！
  if (value instanceof Promise) {
    return value;
  }

  // 如果传进来的是个普通值（数字、字符串、普通对象）
  // 或者是带有 then 方法的 thenable 对象
  // 返回一个新的 Promise，并且立刻把它 resolve 掉
  return new Promise((resolve) => {
    resolve(value);
  });
};