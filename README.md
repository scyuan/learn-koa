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



