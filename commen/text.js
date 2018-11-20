import PageModule from "../lib/Page.js";

const $page = new PageModule({

  data : {
    a:123
  },
  text(){

    console.log(123);
  }
});


export default $page;
