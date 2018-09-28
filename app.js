let koa = require('./application');
let app = new koa();

app.use(async (ctx, next) => {
    await console.log(1)
    await next()
    console.log(2)
})
app.use(async (ctx, next) => {
    await console.log(3)
    await next()
    console.log(4)
})
app.use(async (ctx, next) => {
    await console.log(5)
    await next()
    console.log(6)
})

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