let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');

let EventEmitter = require('events');

class Koa extends EventEmitter{
    constructor(){
        super();
        this.fn;
        // 将三个模块保存，全局的放到实例上
        this.context = context;
        this.request = request;
        this.response = response;
    }
    use(fn){
        this.fn = fn;
    }
    // 核心，创建ctx
    createContext(req, res){
        // Object.create()方法是继承this.context，并且ctx增加属性是不影响原属性也就是this.context
        const ctx = Object.create(this.context);
        // 以前没用到过，相当于
        // const request = Object.create(this.request);
        // const ctx.request = Object.create(this.request);
        const request = ctx.request = Object.create(this.request);
        const response = ctx.response = Object.create(this.response);

        ctx.req = request.req = response.req = req;
        ctx.res = request.res = response.res = res;
        request.ctx = response.ctx = ctx;
        request.response = response;
        response.request = request;

        return ctx;
    }

    // 创建一个处理请求的函数
    handleRequest(req, res){
        // 创建ctx
        let ctx = this.createContext(req, res);
        // 封装好ctx后，通过回调参数返回给用户
        this.fn(ctx);
        // ctx.body用来输出页面，后面会如何说道如何绑定数据到ctx.body
        res.end(ctx.response.body);
    }
    listen(...args){
        // let server = http.createServer(this.fn);
        // server.listen(...args);
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }
}
module.exports = Koa;
