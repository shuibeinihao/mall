let express = require('express');

let rootRoute = require('./routes/rootRoute');
let gpRoute = require('./routes/gpRoute');
let userRoute = require('./routes/userRoute');
let advRoute = require('./routes/advRoute');
let orderRoute = require('./routes/orderRoute');
let productRoute = require('./routes/productRoute');

let guardMiddleware = require('./guardMiddleware');
let bindSessionMiddleware = require('./bindSessionMiddleware');
let sessionViewMiddleware = require('./sessionViewMiddleware');

const router = express.Router();
const guard = guardMiddleware();

router.use((req, res, next) => {
//   res.locals.mixpanel = {token: process.env.MIXPANEL_TOKEN};
//   res.locals.rollbar = {accessToken: process.env.ROLLBAR_ACCESS_TOKEN, environment: process.env.NODE_ENV};
//   next();
// });
// router.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  // res.locals.isMykaishiApp = !(/Mykaishi/i.test(userAgent));
  res.locals.isMykaishiApp = /Mykaishi/i.test(userAgent);
  res.locals.isWeixin = /MicroMessenger/i.test(userAgent);
  next();
});
router.use(bindSessionMiddleware());
router.use(sessionViewMiddleware());
router.use('/', rootRoute);
router.use('/user', userRoute); //登录
router.use('/adv', advRoute);
router.use('/product', productRoute);
router.use('/gp', guard, gpRoute); //个人中心
router.use('/order', guard, orderRoute); //通用订单

module.exports = router;
