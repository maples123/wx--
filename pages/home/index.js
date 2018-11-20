import Event from "../../lib/Event.js";
import PageModule from "../../lib/Page.js";
import AppModule from "../../lib/App.js";

const $page = new PageModule();


const app = getApp();//获取App的this实例

const appExample = app.example;
$page.addEvent("onLoad",function(){
  
 console.log("holle world")
})


$page.start();