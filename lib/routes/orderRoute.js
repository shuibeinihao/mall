let express = require('express');
let md5 = require('md5');
let httpRequest = require('../httpRequest');

function md5Obj(obj, key) {
  let keys = Object.keys(obj).sort();
  let str = keys.map(key => `${key}=${obj[key]}`).join('&');
  return md5(`${str}&key=${key}`).toUpperCase();
}

const router = express.Router();

router.get('/pay/weixin', (req, res) => {
  const { state, msg, id } = req.query;
  const key = 'prepay_id';
  const prepayId = req.query[key];

  const nonceStr = md5('' + Math.random());
  const weixinObj = {
    appId: 'wxd5006d3859ece209',
    timeStamp: '' + Math.floor(Date.now() / 1000),
    nonceStr,
    package: `prepay_id=${prepayId}`,
    signType: 'MD5'
  };

  weixinObj.paySign = md5Obj(weixinObj, '1cd5f45ebdb011e68df900163e00b4ad');
  res.render('gp/payWeixin.njk', {
    cssFiles: ['../../vendor/icons/style', 'pay'],
    jsFiles: [state == 1 ? 'payWeixin' : 'pay'],
    appClass: 'app-grey order',
    state, msg, orderId: id,
    prepayId, weixinObj
  });
});

router.get('/pay/:id', (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.sendStatus(404);
    return;
  }

  httpRequest(req, `/api/trade/porder/${id}`)
    .then(result => {
      if (result.success === false) {
        next(new Error(result.retMsg));
        return;
      }

      res.render('gp/pay.njk', {
        cssFiles: ['../../vendor/icons/style', 'pay'],
        jsFiles: res.locals.isWeixin ? [] : ['pay'],
        appClass: 'app-grey order',
        baseCss: false,
        orderId: id,
        totalMoney: result.data.pOrder.money
      });
    }, next);
});

module.exports = router;
