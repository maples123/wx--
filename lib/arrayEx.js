
//设置命名空间
Array.prototype.pushNameSpace = function(...arg){

  arg = arg.map(item => {

    if(/object/i.test(typeof item)){

      if(item.nameSpace){
        
        return {
          nameSpace: item.nameSpace,
          data: item.data
        }
      }else{

        return {
          nameSpace: "defalut",
          data: item
        }
      }
    }else{

      return {
        nameSpace : "defalut",
        data : item
      }
    }
  })

  this.push(...arg);
}

//查询带有命名可见的return的值
Array.prototype.findNameSpace = function (nameSpace="default",subScript){

  const data = this.filter(item => {
    
    return nameSpace === item.nameSpace;
  }).map(item => item.data)
 
  if (subScript === undefined){

    subScript = data.length - 1;
    
    subScript = Math.max(0, subScript)
  }
  return data[subScript];
}

export default Array;