function curry(fn) {
    return function curried(...args) {
        // 如果参数够了，直接执行
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        // 否则返回一个函数继续收集参数
        return function (...nextArgs) {
            return curried.apply(this, [...args, ...nextArgs]);
        };
    };
}