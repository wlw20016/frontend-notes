//使用Map做id和对象的映射
function obj2tree(objs){
    const res = []
    const treeMap = new Map()
    for(const obj of objs){
        //console.log(typeof obj) //object
        treeMap.set(obj.id, {...obj, children : []})
    }

    for(const obj of objs){
        const self = treeMap.get(obj.id)
        if(self.parentId !== null){
            const parent =  treeMap.get(self.parentId)
            
            //  console.log(parent) 
             parent.children.push(self)
        }else{
            res.push(self)
        }
    }
    return res
}

const flatData = [
    { id: 1, name: '部门A', parentId: null }, // 0 表示根节点
    { id: 2, name: '部门B', parentId: null },
    { id: 3, name: '部门A-1', parentId: 1 },
    { id: 4, name: '部门A-2', parentId: 1 },
    { id: 5, name: '部门B-1', parentId: 2 },
    { id: 6, name: '部门A-1-a', parentId: 3 },
];

const objTree = obj2tree(flatData)
console.log(objTree)