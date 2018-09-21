let koa = require('./application');
let app = new koa();

app.use((ctx)=>{
    console.log(ctx);
})
app.listen(3000);

console.log('http://localhost:3000');