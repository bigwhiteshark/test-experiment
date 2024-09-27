const http = require('http')

http.createServer((req,res)=>{
    res.end('port:8888')
}).listen(8888,'0.0.0.0')