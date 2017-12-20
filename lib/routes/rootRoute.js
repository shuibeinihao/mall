let express = require('express');
let area = require('./a.json');
let MobileDetect = require('mobile-detect');
let querystring = require('querystring');
let mapGet = require('../mapGet');
let mapRequest = require('../mapRequest');
const router = express.Router();

router.get('/', (req, res) => {
  mapGet(req, {
    homeData: '/api/trade/mall/home',
  }).then(result => {
    if (result.homeData.success) {
      res.render('gp/home.njk', {
        cssFiles: [
          '../../vendor/swiper/dist/css/swiper.min',
        ],
        jsFiles: ['home'],
        appClass: '',
        data: result.homeData.data,
      });
    }
  });
});

router.get('/pickupgifts', (req, res) => {
  if (req.query.picked == 1) {
    renderResult(req, res, false);
    return;
  }
  res.sendStatus(404);
});

router.get('/pickupgifts/:organization-:id-:sign', (req, res) => {
  const md = new MobileDetect(req.headers['user-agent']);
  if (md.mobile()) {
    res.render('gp/order.pickupgifts.njk', {
      cssFiles: ['order'],
      jsFiles: ['pickupgifts'],
      input: req.params,
      area,
      appClass: 'app-grey order'
    });
  } else {
    res.render('gp/order.pickupgifts.pc.njk', {
      cssFiles: ['pickupgifts.pc'],
      jsFiles: ['pickupgiftspc'],
      input: req.params,
      area
    });
  }
});

function renderResult(req, res, isOk) {
  const md = new MobileDetect(req.headers['user-agent']);
  if (md.mobile()) {
    res.render('gp/order.pickupgifts.result.njk', {
      cssFiles: ['order'],
      isOk,
      appClass: 'app-grey order'
    });
  } else {
    res.render('gp/order.pickupgifts.result.pc.njk', {
      cssFiles: ['pickupgifts.pc'],
      isOk
    });
  }
}

router.get('/pickupgifts/:result', (req, res) => {
  const {result} = req.params;
  if (!(result === 'ok' || result === 'fail')) {
    res.sendStatus(404);
    return;
  }
  renderResult(req, res, req.params.result === 'ok');
});

router.get('/couponcode', (req, res) => {
  const {msg, couponId, sign, money, name} = req.query;
  if (msg) {
    const md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
      res.render('gp/couponcode.error.njk', {msg, cssFiles: ['order']});
    } else {
      res.render('gp/couponcode.error.pc.njk', {msg, cssFiles: ['pickupgifts.pc']});
    }
  } else {
    // 有money为优惠券
    if (money) {
      if (!(couponId && sign && money)) {
        res.sendStatus(406); //StatusNotAcceptable
        return;
      } else {
        res.redirect(`/gp/coupon-bind-get?${querystring.stringify(req.query)}`);
      }
      // 没有money为身份绑定
    } else {
      if (!(couponId && sign && name)) {
        res.sendStatus(406); //StatusNotAcceptable
        return;
      } else {
        res.redirect(`/gp/coupon-download?${querystring.stringify(req.query)}`);
      }
    }
  }
});

router.get('/distributor/:userId', (req, res, next) => {
  const {userId} = req.params;
  let _map = {
    distributorInfo: {
      url: `/api/trade/mall/distributor/${userId}/coupon/group`,
      method: 'GET',
      body: {},
    }
  };

  mapRequest(req, _map)
    .then((result) => {
      res.render('gp/distributor.njk', {
        cssFiles: [],
        jsFiles: [''],
        appClass: '',
        data: result.distributorInfo
      });
    })
    .catch(err => {
      next(JSON.stringify(err));
    });
});

module.exports = router;
