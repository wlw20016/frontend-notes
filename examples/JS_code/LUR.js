class LRUCache{
    constructor(capacity){
        this.capacity = capacity
        this._map = new Map()
    }

    has(key){
        return this._map.has(key)
    }

    get(key){
        if(!this.has(key)) return -1
        const value = this._map.get(key)
        this._map.delete(key)
        this._map.set(key, value)
        return value
    }

    set(key, value){
        //Map中会严格保留键的首次插入顺序，如果不做删除，而只是替换的话，是不行的
        if(this._map.has(key)){
            this._map.delete(key)

        }
        this._map.set(key, value)

        if(this._map.size > this.capacity){
            // this._map.keys() 返回一个迭代器
            // .next().value 可以精准拿到 Map 里排在第一位的 key！
            const oldestKey = this._map.keys().next().value
            this._map.delete(oldestKey)
        }
    }
}