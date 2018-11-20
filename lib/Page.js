import Event from "./Event.js";

const app = getApp();//获取App的this实例

export default class PageModule extends Event {

  constructor(data) {
    super();
    
    //保存PageModule的this实例
    const pageExample = this;

    this.addEvent("onLoad", function () {
     
      //将page实例挂在到App上
      Reflect.set(app, "page", {
        example: pageExample,
        page: this,
        route: this.route
      })

    })

    //继承属性和方法
    data && this.extend(data);
  }

  //事件和属性的刷选方法
  static select(obj){

    const events = {},
          data = {};

    Object.keys(obj).forEach(key => {

      if(/function/i.test(typeof obj[key])){
        
        events[key] = obj[key];//保存函数
      }else{

        data[key] = obj[key];//保存数据
      }
    })

    return {events,data};
  }

  //导出方法
  exports(...arg){

    arg = arg.length ? arg : Object.keys(this.events);
    
    const events = {};
    arg.forEach(eType => {

      if(/function/i.test(typeof this[eType])){

        events[eType] = this[eType];
      }else{

        throw new Error(eType+"不是一个方法")
      }
    })

    return events;
  }

  //导入
  extend(obj){

    const {events,data} = PageModule.select(obj);


    //添加方法
    for(let eType in events){

      this.addEvent(eType,obj[eType]);
    }

    //添加属性
    Object.assign(this,data);
  }

  //初始化方法
  start(data){
    
    //继承属性和方法
    data && this.extend(data);

    Page(this);
  }
}