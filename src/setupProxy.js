const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware('/account', 
        { 
            target: 'http://localhost:8080/',
            changeOrigin: true 
        }
    ));
    app.use(createProxyMiddleware('/login', 
        { 
            target: 'http://localhost:8080/',
            changeOrigin: true 
        }
    ));
}