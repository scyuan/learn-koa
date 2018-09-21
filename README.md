### 写在前面

为了更好的学习koa，但是以目前的水平去阅读koa源码可能还是力所不能及（虽然koa源码总共才1800行）。所以跟随教程来实现一个koa，下面会记录整个过程，供以后学习。

### 开始，准备工作，新建项目

koa官方是四个js文件：application.js、context.js、request.js、response.js。所以我这里也新建这个四个文件。

#### 准备工作

原生的node启动一个服务

```JavaScript
let http = require('http')
let server = http.createServer((req, res) => {
  res.end('hello world')
})
server.listen(3000);
```
koa启动一个服务
```JavaScript
const koa = require('koa');
const app = new Koa();

app.use((ctx, next) => {
  ctx.body = 'Hello World';
});
app.listen(3000);
```
##### listen
koa的listen方法其实就是http的语法糖，本质上还是使用了http.createServer()。
##### ctx
ctx利用了上下文（context）机制，将原来的req,res合二为一，并进行了大量拓展。
##### use
koa的核心。

### 创建一个ctx

通过createContext创建一个ctx，我的理解就是讲request和response添加到ctx这个对象当中

```JavaScript
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
```
在app.js中
```JavaScript
app.use((ctx)=>{
    console.log(ctx.req.url);              // 打印  '/'
    console.log(ctx.request.req.url);      // 打印  '/'
    console.log(ctx.url);                  // 打印  undefined
})
```

### 从自定义的request对象取值，并拓展更多熟悉，如query、path等。直接从ctx取值