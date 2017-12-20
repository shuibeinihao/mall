let httpProxy = require('http-proxy');
let cookie = require('cookie');

const proxy = httpProxy.createProxyServer({ changeOrigin: true });
proxy.on('proxyReq', function (proxyReq, req) {
  if (req.session.token) {
    //req.headers.cookie = req.headers.cookie + '; ' + cookie.serialize('ucn', req.session.token);
    proxyReq.setHeader('Cookie', cookie.serialize('ucn', req.session.token));
  }
  proxyReq.setHeader('_version', process.env.API_VERSION);
});

module.exports = () => (req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.substr(4);
    proxy.web(req, res, { target: process.env.API_MYKAISHI }, next);
  } else {
    next();
  }
};
