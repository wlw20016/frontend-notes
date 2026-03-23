class Emitbus{

    constructor(){
        this.event = {}
    }
    //订阅
    on(event, callback){
        if( !this.event[event] ){
            this.event[event] = []
        }
        this.event[event].push(callback)
    }
    //发布
    emit(event, ...args){
        const callbackList = this.event[event]
        if(callbackList && callbackList.length > 0){
            callbackList.forEach(cb => cb(...args))
        }
    }

    //取消
    off(event, callback){
        if(!this.event[event]) return 
        const callbackList = this.event[event]
        this.event[event] = callbackList.filter(cb=>{
            cb !== callback && cb.initCallback !== callback
        })
    }

    //订阅一次
    once(event, callback){
        const onceCallback = (...args)=>{
            callback(...args)
            this.off(event, onceCallback)
        }
        //防止手动取消时，找不到callback
        onceCallback.initCallback = callback
        this.on(event, onceCallback)
    }
}