let http = require('http');


let context = require('./context');
let request = require('./request');
let response = require('./response');

let EventEmitter = require('events');

class Koa extends EventEmitter{
    constructor(){
        super();
        this.fn;
    }
    use(fn){
        this.fn = fn;
    }
    listen(...args){
        let server = http.createServer(this.fn);
        server.listen(...args);
    }
}
module.exports = Koa;
