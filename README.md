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
    // 这个时候还无法直接在ctx包括ctx.request取url等值
    console.log(ctx.url);                  // 打印  undefined
    console.log(ctx.request.url);          // 打印  undefined
})
```
### 从自定义的request对象取值，并拓展更多熟悉，如query、path等。直接从ctx取值

#### 从自定义的request取值

```JavaScript
let request = { 
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
```
所以在app.js中
```JavaScript
app.use((ctx)=>{
    console.log(ctx.req.url);              // 打印  '/'
    console.log(ctx.request.req.url);      // 打印  '/'
    console.log(ctx.url);                  // 打印  undefined
    console.log(ctx.request.url);          // 打印  '/'
})
```

#### 直接从ctx取值

需要通过一个代理实现

修改context.js
```JavaScript
let context = {}
// 创建一个defineGetter函数，参数分别是需要代理的对象和对象上的属性
function defineGetter(prop, name){
    // 每个对象都有一个__defineGetter__函数，可以用这个方法实现代理。
    context.__defineGetter__(name, function(){
        // 这里的this是ctx，为什么是ctx？
        return this[prop][name];
    })
}
defineGetter('request','url');
module.exports = context;
```
怎么实现代理？

**__defineGetter__**方法可以将一个函数绑定在当前对象的指定属性上，当那个属性的值被读取时，所绑定的函数就会被调用。
上诉例子：
```JavaScript
context.__defineGetter__(name, function(){
        // 这里的this是ctx，为什么是ctx？
        return this[prop][name];
    })
```
defineGetter('request','url');
当调用context.url时，出发绑定函数，return this.request.url；
由于ctx继承了context（在application.js中const ctx = Object.create(this.context)）。所以当ctx.url，触发了绑定函数，返回this.request.url。（this即为ctx）

所以在app.js中
```JavaScript
app.use((ctx)=>{
    console.log(ctx.req.url);              // 打印  '/'
    console.log(ctx.request.req.url);      // 打印  '/'
    console.log(ctx.url);                  // 打印  '/'
    console.log(ctx.request.url);          // 打印  '/'
})
```

### 实现ctx.body

koa的api，输出数据到页面既不是res.end('xxx')也不是res.send('xxx')，而是ctx.body = 'xxx'。

#### 首先修改response

```JavaScript
let response ={
    set body(value){
        this.res.statusCode = 200;
        this._body = value;
    },
    get body(){
        return this._body;
    }
}
```
在application.js中
```JavaScript
handleRequest(req, res){
    // 创建ctx
    let ctx = this.createContext(req, res);
    // 封装好ctx后，通过回调参数返回给用户
    this.fn(ctx);
    // ctx.body用来输出页面，后面会如何说道如何绑定数据到ctx.body
    // 将ctx.response.body输出
    res.end(ctx.response.body);
}
```
在app.js中,可以直接设置ctx.response.body = 'hello world',这样就会输出hello world了

```JavaScript
app.use((ctx)=>{
    console.log(ctx.req.url);
    console.log(ctx.request.req.url);
    // 通过自定义的request对象，可以直接通过ctx的request对象获取url了
    console.log(ctx.request.url);
    console.log(ctx.url);

    ctx.response.body = 'hello world';
    
})
```
这个时候是ctx.response.body,并不是ctx.body。同意通过contex代理一下

context.js
```JavaScript
function defineSetter(prop, name){
    context.__defineSetter__(name,function(val){
        this[prop][name] = val;
    })
}
defineSetter('response','body');
defineGetter('response','body');
```

这个时候就可以直接使用ctx.body了。