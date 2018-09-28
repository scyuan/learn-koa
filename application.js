let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');

let EventEmitter = require('events');

class Koa extends EventEmitter{
    constructor(){
        super();
        // this.fn; 改成：
        this.middlewares = [] // 按顺序存放中间件
        // 将三个模块保存，全局的放到实例上
        this.context = context;
        this.request = request;
        this.response = response;
    }
    use(fn){
        // this.fn = fn;
        // 每次use将回调函数存进数组
        this.middlewares.push(fn);
    }

    compose(middlewares, ctx){
        function dispatch(index){
            if(index == middlewares.length ) return Promise.resolve();  // 最后一次执行直接返回；
            let middleware = middlewares[index]        // 取出函数
            //middleware(ctx, () => dispatch(index+1))   // 调用并传入ctx和下一个被调用的函数，用户通过next()时执行该函数
            return Promise.resolve(middleware(ctx, () => dispatch(index+1)))
        }
        return dispatch(0);
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
        // this.fn(ctx); 多次调用use,所以改成；
        // this.compose(this.middlewares,ctx);
        let fn = this.compose(this.middlewares,ctx);
        fn.then(()=>{
            // ctx.body用来输出页面，后面会如何说道如何绑定数据到ctx.body
            res.end(ctx.response.body);
        })
    }
    listen(...args){
        // let server = http.createServer(this.fn);
        // server.listen(...args);
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }
}
module.exports = Koa;
