let koa = require('./application');
let app = new koa();

app.use((req, res)=>{
    res.end('hello world')
})
app.listen(3000);

console.log('http://localhost:3000');