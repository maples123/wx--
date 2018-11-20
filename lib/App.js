import Event from "./Event.js";

let app;

export default class AppModule extends Event{
  //全局数据
  globalData = {}

  constructor(){
    super();
  }

  //全局数据修改方法
  data(...arg){

    //获取全部数据
    if(arg.length === 0){
      
      return this.globalData;
    }else if(arg.length === 1){

      const argData = arg[0];
      //获取指定数据
      if (/string/i.test(typeof argData)){
        
        return this.globalData[argData]
      } else if (/object/i.test(typeof argData)){//设置数据
        
        for (let key in argData){

          this.data(key, argData[key]);
        }
      }
    }else if(arg.length === 2){//设置数据
      
      Reflect.set(this.globalData,arg[0],arg[1]);
    }
  }

  //给当前页面添加数据
  assign(key,value){

    const pageData = app.page.page;
    
    if(/string/i.test(typeof key) && value !== undefined){

      pageData.setData({
          [key] : value
        })
    }else if(/object/i.test(typeof key)){

      pageData.setData(key);
    }
  }

  //初始化方法
  start(){
    //保存AppModule的this
    const appExample = this;

    this.addEvent("onLaunch",function(){
      
      //将AppModule的this挂在到App的实例上
      Reflect.set(this, "example", appExample);

      app = this;
    })

    //App方法调用时接受一个对象，通过浅拷贝的方法添加到App方法里面
    App(this);
  }
}