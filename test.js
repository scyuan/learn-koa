class App{
    constructor(){
        this.funcs = [];
    }
    use(fn){
        this.funcs.push(fn);
    }
    compose(funcs){
        function dispathch(index){
            if(index == funcs.length) return;
            let func = funcs[index];
            func(()=>dispathch(index+1))
        }
        dispathch(0);
    }
    run(){
        this.compose(this.funcs);
    }
}

let app = new App();

app.use(async (next) => {
    console.log(1);
    await next()
    console.log(2)
})
app.use(async (next) => {
    console.log(3)
    let p = new Promise((resolve, roject) => {
        setTimeout(() => {
            console.log('3.5')
            resolve()
        }, 1000)
    })
    await p.then()
    await next()
    console.log(4)
})
app.use(async (next) => {
    console.log(5)
    await next()
    console.log(6)
})

async function demo(){
    console.log(1);
    await console.log(2);
    console.log(3);
}

app.run();
