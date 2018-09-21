let url = require('url');
let request ={
    get url(){
        //这样可通过ctx.request.url 直接取值了。不需要再通过req
        return this.req.url;
    }
}

module.exports = request;