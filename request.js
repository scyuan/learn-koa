let url = require('url');
let request ={
    // get 用法为对象的访问器类似于下面
    // Object.defineProperty('name',{
    //    set:function(value){
    //          this.name = value;
    //    },
    //    get:function(){
    //        return this.name;
    //    }
    // })
    get url(){
        //这样可通过ctx.request.url 直接取值了。不需要再通过req
        return this.req.url;
    }
}

module.exports = request;