
const whereCompare = {
  "=" : (that,value) => {

    return that == value;
  },
  ">": (that, value) => {

    return that > value;
  },
  "<": (that, value) => {

    return that < value;
  }
}


//
export default class Storage{

  constructor(dbname){

    Object.assign(this,{
      dbname,//类的缓存名
      cache : {//类的缓存容器
        add : {
          data:[]
        }
      }
    })
    // console.log(Storage.getDb(this.dbname))
  }
  
  //实时获取类的储存数据
  static getDb(dbname) {

    return wx.getStorageSync(dbname) || [];
  }

  static getWhere(action){

    if(this.whereFn){

      return this.whereFn;
    }else{

      throw new Error("调用" + action + "方法时，请先调用where方法")
    }
  }

  //添加数据到类的缓存中
  add(data){

    if(Array.isArray(data)){
      data.forEach(item => {

        this.add(item)
      })
    }else if(/object/i.test(typeof data)){
      
      this.cache.add.data.push(data)
    }else{

      throw new Error("add方法只接收数组和对象，且两者不为空")
    }
    return this;
  }

  del(){

    this.cache.del = {
      where : Storage.getWhere.call(this,"del")
    }

    return this;
  }

  updata(data){

    if(/object/i.test(typeof data)){
      
      this.cache.updata = {
        data,
        where : Storage.getWhere.call(this,"updata")
      }
    }else{

      throw new Error("updata方法只接受对象为参数")
    }
    return this;
  }

  //将数据储存到本地
  save() {
    //获取类的数据
    let db = Storage.getDb(this.dbname);
    //删出数据
    if(this.cache.del){
        
      db = db.filter(item => {
        
        return !this.cache.del.where(item);
      })
    }

    //修改数据
    if (this.cache.updata) {

      db.forEach(item => {

        if (this.cache.updata.where(item)) {
          
          Object.assign(item, this.cache.updata.data)
        }
      })
    }

    //将数据保存到本地
    if (this.cache.add) {

      db.push(...this.cache.add.data)
      //将数据保存到本地
      wx.setStorageSync(this.dbname, db)
    } else {

      throw new Error("数据保存失败，保存的数据不能为空")
    }
    //清空类的缓存
    this.cache = {
      add: {
        data: []
      }
    }
    return this;
  }

  //查询条件
  where(...arg){

    let [key,compare,value] = arg;
    if (value === undefined){
      value = compare;

      compare = "=";
    }

    const compareFn = whereCompare[compare]
    if (compareFn){

      this.whereFn = (item) => {
        return compareFn(item[key],value)
      }

    }else{

      throw new Error("where方法不支持"+compare+"查询方式")
    }
    return this;
  }


  //查询多个
  select(){
    //获取类的数据
    const db = Storage.getDb(this.dbname);

    const data = db.filter(Storage.getWhere.call(this, "select"))

    this.sortFn && data.sort(this.sortFn)

    return this.sliceArg ? data.slice(...this.sliceArg) : data;
  }

  //排序方法
  order(key,sort="esc"){
   
    this.sortFn = (a,b) => {

      return /desc/i.test(sort)
            ? b[key] - a[key] 
            : a[key] - b[key];
    }

    return this;
  }

  //截取数据
  limit(start,end){

    if( end === undefined){
      
      end = start;
      start = 0;
    }else{

      --start;
      end += start;
      Math.max(0,start);
    }
    this.sliceArg = [start,end];
    return this;
  }


  //查询方法
  find() {
    //获取类的数据
    const db = Storage.getDb(this.dbname);

    return db.find(Storage.getWhere.call(this, "find"))
  }

}