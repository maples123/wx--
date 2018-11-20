import ArrayEx from "./arrayEx.js";

export default class Event{

  constructor(){

    //用于保存时间类型和事件函数
    Object.defineProperty(this,"events",{
      value : {},
      enumerable : false//不可比遍历属性
    })
   
  }

  //事件触发器
  static createEventHandle(eType,that){

    //生成事件触发器的包装函数,将函数设置到Page实例中
    Reflect.set(that, eType,function(...arg){

      //保存this实例
      const page = this,
            data = [];

      //查询事件函数 //拷贝一份事件队列
      const eTypeFn = Array.from(Reflect.get(that.events, eType));

      ((function recur(){
        //每次让第一个出列执行
        const f = eTypeFn.shift();

        //执行函数
        f && data.pushNameSpace(f.apply(page, arg));

        //事件队列数组不为空，就会调用递归
        eTypeFn.length && recur();

      })())

      return data;
    })
  }

  //查询事件
  getEvent(eType){
    //查询事件函数
    let eTypeFn = Reflect.get(this.events,eType);
  
    if (eTypeFn === undefined){
      
      eTypeFn = [];//用于保存时间函数的数组

      Reflect.set(this.events, eType, eTypeFn)
      //事件触发器
      Event.createEventHandle(eType,this)
    }

    return eTypeFn;
  }

  //添加事件
  addEvent(eType,callback){

    const eTypeFn = this.getEvent(eType);

    eTypeFn.push(callback);//添加事件函数

  }

  //删除事件
  removeEvent(eType,callbakc){

    if (callbakc){

      const eTypeFn = this.getEvent(eType);
      const index = eTypeFn.findIndex(item => item === callbakc);

      index != -1 && eTypeFn.splice(index,1);
    }else{

      Reflect.set(this.events,eType,[]);
    }
  }
  //一次性事件
  onEvent(eType, callback){
    //保存Event的this
    const that = this;
    
    const handle = function(...arg){

      callback.apply(this,arg);
      
      that.removeEvent(eType,handle);
    }

    this.addEvent(eType,handle);
  }
}