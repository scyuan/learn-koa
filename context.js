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

/*  代理原理
    __defineGetter__方法可以将一个函数绑定在当前对象的指定属性上，当那个属性的值被读取时，所绑定的函数就会被调用。
    上诉例子：
    context.__defineGetter__(name, function(){
        // 这里的this是ctx，为什么是ctx？
        return this[prop][name];
    })
    defineGetter('request','url');
    当调用context.url时，出发绑定函数，return this.request.url；
    由于ctx继承了context（在application.js中const ctx = Object.create(this.context)）。所以当ctx.url，触发了绑定函数，返回this.request.url。（this即为ctx）
*/

function defineSetter(prop, name){
    context.__defineSetter__(name,function(val){
        this[prop][name] = val;
    })
}

defineSetter('response',"body");
defineGetter('response',"body");

module.exports = context;