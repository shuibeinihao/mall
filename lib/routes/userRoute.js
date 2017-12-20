let express = require('express');
let fetch = require('node-fetch');
let csurf = require('csurf');
let cookie = require('cookie');
// let httpRequest = require('../httpRequest');
let errorHelper = require('../errorHelper');
let jwt = require('jsonwebtoken');
let appendQuery = require('append-query');

const router = express.Router();
const csurfProtection = csurf({});

function post(url, data, headers = {}) {
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.all([response.json(), response.headers]);
    } else {
      return response.json()
        .then(res => Promise.reject(res));
    }
  }

  url = url.replace(/^\/api/, process.env.API_MYKAISHI);
  return fetch(url, {
    method: 'POST',
    headers: Object.assign({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, headers),
    body: JSON.stringify(data)
  })
    .then(checkStatus);
}

function sendError(res, error) {
  res.status(400).json({ message: error });
}

/**
 * 登录界面
 */
router.get('/login', csurfProtection, (req, res) => {
  if (req.query.redirect) {
    req.session.redirect = req.query.redirect;
    if (req.query.bind == 1) {
      req.session.redirectBind = true;
    }
  }

  //邀请注册
  if (req.query.x) {
    req.session.inviteHeaders = {
      _inviteUserId: req.query.x
    };
    req.session.redirectBind = true;
    req.session.redirect = process.env.WEBSITE_URL+'/me';
  }

  res.render('login.njk', {
    cssFiles: ['login'],
    jsFiles: ['login'],
    csrfToken: req.csrfToken(),
    baiduStats: true
  });
});

/**
 * 登录
 */
router.post('/login', csurfProtection, (req, res) => {
  const { type, area, loginId, password } = req.body;
  if (!(type == 1 || type == 2)) {
    sendError(res, '登录类型不正确');
    return;
  }

  if (!area) {
    sendError(res, '缺少手机号码地区信息');
    return;
  }

  if (!/^\d{3,}$/.test(loginId)) {
    sendError(res, '缺少有效的手机号码');
    return;
  }

  if (!password) {
    sendError(res, '缺少密码信息');
    return;
  }

  const data = {
    type: type == 1 ? 'Sms' : 'Phone',
    password,
    loginId: `${area} ${loginId}`
  };

  const url = '/api/user/login';
  post(url, data, req.session.inviteHeaders)
    .then(result => {
      const setCookie = result[1].get('set-cookie');
      const parsedCookie = cookie.parse(setCookie);
      req.session.token = parsedCookie.ucn;
      req.session.user = result[0];
      let url = req.session.redirect || '/gp/me';
      delete req.session.redirect;
      delete req.session.inviteHeaders;
      if (req.session.redirectBind) {
        delete req.session.redirectBind;
        const claims = {
          data: { token: parsedCookie.ucn, id: result[0].id },
        };
        const secret = '67ddf4fb-e4b5-410b-abfb-67dba6c79c17';
        let token = jwt.sign(claims, secret, { expiresIn: 5 });
        url = appendQuery(url, { _1: token });
      }

      res.json({
        redirect: url,
        userId: result[0].id,
        userInfo: result[0].info,
        userPrivateInfo: result[0].privateInfo,
        userCreatedDate: result[0].created});
    })
    .catch(error => sendError(res, errorHelper(error)));
});

/**
 * 发送短信验证码
 */
router.post('/sendphonevalidation', csurfProtection, (req, res) => {
  const { area, phone } = req.body;
  if (!area) {
    sendError(res, '缺少手机号码地区信息');
    return;
  }

  if (!/^\d{3,}$/.test(phone)) {
    sendError(res, '缺少有效的手机号码');
    return;
  }

  const url = '/api/user/send-phone-validation';
  const data = {
    phone: `${area} ${phone}`
  };
  post(url, data)
    .then(() => res.json({ message: 'ok' }))
    .catch(error => sendError(res, errorHelper(error)));
});

router.get('/self', (req, res) => {
  if (!req.session.user) {
    res.sendStatus(401); //401 Unauthorized
    return;
  }

  res.json(req.session.user);
});

/**
 * 注销
 */
router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
