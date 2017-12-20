require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
let methodOverride = require('method-override');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let route = require('./lib/route');
const proxyMiddleware = require('./lib/proxyMiddleware');
const nunjucksEnv = require('./lib/nunjucksEnv');
const render404 = require('./middleware/render404');
const render500 = require('./middleware/render500');

// 载入配置文件
// const config = require('./config/config');

const app = express();
app.locals = {
  css: true,
  js: true,
  baiduStats: false,
  baseCss: true
};

/******************************************************
 * Initialize i18n modules
 ******************************************************/
// i18n.configure({
//   locales:['en-US', 'zh-CN'],
//   defaultLocale: 'zh-CN',
// });
// app.configure(function() {
//   // default: using 'accept-language' header to guess language settings
//   app.use(i18n.init);
// });


const secret = '59031f85-91ae-436b-80cf-5f5c85f93fa6';
const isDev = app.get('env') === 'local';
nunjucksEnv({ express: app, isDev });

app.set('trust proxy', true);
app.use(methodOverride('_method'));
app.use(morgan('combined')); //logger at all env. todo: logger to file and depends on the env.

if (isDev) {
  const assetsMiddleware = require('./lib/assetsMiddleware');
  app.use('/assets', assetsMiddleware('./assets'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(secret));
app.use(/^(?!\/api)/, bodyParser.urlencoded({ extended: false }));
app.use(/^(?!\/api)/, bodyParser.json());
app.use(session({
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    pass: process.env.REDIS_PWD,
    db: +process.env.REDIS_DB
  }),
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    //If secure is set, and you access your site over HTTP, the cookie will not be set.
    //secure: true,
    maxAge: 86400000,
    httpOnly: true
  },
}));

/******************************************************
 * Routes
 ******************************************************/
app.use(route);
app.use(proxyMiddleware());

/******************************************************
 * Error Handling
 ******************************************************/
app.use(render404());
app.use(render500());

/******************************************************
 * Boot up the server
 ******************************************************/
//todo:可配置
app.listen(10008, () => {
  console.log('Running...'); //eslint-disable-line no-console
});
