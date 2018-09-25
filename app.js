let koa = require('./application');
let app = new koa();

app.use((ctx)=>{
    console.log(ctx.req.url);
    console.log(ctx.request.req.url);
    // 通过自定义的request对象，可以直接通过ctx的request对象获取url了
    console.log(ctx.request.url);
    console.log(ctx.url);

    ctx.body = 'hello world';
    
})
app.listen(3000);

console.log('http://localhost:3000');