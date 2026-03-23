//第一种 调度器类 字节
function timeout(time) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve()
        }, time)
    })
}

class SuperTask{
    constructor(parallelCount = 2){
        this.parallelCount = parallelCount
        this.tasks = []
        this.runningCount = 0
    }

    add(task){
        return new Promise((resolve, reject)=>{
            this.tasks.push({task, resolve, reject})
            this._run()
        })
    }

    _run(){
        while(this.runningCount < this.parallelCount && this.tasks.length > 0){
            //  this.tasks.shift() 返回数组的第一个元素，并且将第一个元素从数组中剔除
            const {task, resolve, reject} = this.tasks.shift() 
            this.runningCount++
            task().then(resolve, reject).finally(()=>{
                this.runningCount--
                this._run()
            })
        }
    }
}

const superTask = new SuperTask()
function addTask(time, names){
    superTask
        .add(() => timeout(time))
        .then(()=>{
            console.log(`任务${names}完成`)
        })
}
addTask(10000,1);
addTask(5000,2);
addTask(3000,3);
addTask(4000,4);
addTask(5000,5);
//第二种 并发池
