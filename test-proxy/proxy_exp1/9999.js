const http = require('http')

http.createServer((req,res)=>{
    res.end('port:9999')
}).listen(9999,'0.0.0.0')