// 递归 + reduce实现
// function flatten(arr){
//     return arr.reduce((arry, cur)=>{
//         return arry.concat(Array.isArray(cur) ? flatten(cur) : cur)
//     }, [])
// }



const array = [1,[2,[3,[4,[5]]]]]
const newArray = flatten(array)
console.log(newArray)