const createProxyMiddleware = require('http-proxy-middleware');

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://kodo-capstone-backend.herokuapp.com'

module.exports = function(app) {
    app.use(createProxyMiddleware('/account', 
        { 
            target: url,
            changeOrigin: true 
        }
    ));
    app.use(createProxyMiddleware('/login', 
        { 
            target: url,
            changeOrigin: true 
        }
    ));
    app.use(createProxyMiddleware('/course',
        {
            target: url,
            changeOrigin: true
        }))
}