const http = require('http');
const httpProxy = require('http-proxy');
//创建一个代理服务
const proxy = httpProxy.createProxyServer();
 
//虚拟主机
const hosts = {
    'www.a.me': 'http://localhost:8888',
    'www.b.me': 'http://localhost:9999',
};
 
//创建http服务器并监听80端口
let server = http.createServer(function (req, res) {
    //获取主机名
    let host = req.headers['host'];
    host = host.split(':')[0];
    //根据主机名，找到要代理的服务
    let target = hosts[host];
    if (target) {
        proxy.web(req, res, {
            target: target
        });
        proxy.on('error', function (err) {
            console.log(err);
        });
    } else {
        res.end('end');
    }
});
server.listen(80, '0.0.0.0');