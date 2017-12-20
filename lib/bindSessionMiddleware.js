let fetch = require('node-fetch');
let cookie = require('cookie');

function get(url, headers) {
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return response.json()
        .then(res => Promise.reject(res));
    }
  }

  url = url.replace(/^\/api/, process.env.API_MYKAISHI);
  return fetch(url, {
    method: 'GET',
    headers
  })
    .then(checkStatus)
    .then(res => res.json());
}

module.exports = () => (req, res, next) => {
  // const ucnCookie = req.query.token || req.headers.xkstoken || req.headers.ucn; //todo: 添加token
  const ucnCookie = req.query.token || req.headers.ucn || req.headers.xkstoken;
  if (ucnCookie) {
    const parsedCookie = cookie.parse(decodeURIComponent(ucnCookie));
    if (req.session.token !== parsedCookie.ucn) {
      const reqHeaders = {
        Accept: 'application/json',
        Cookie: cookie.serialize('ucn', parsedCookie.ucn)
      };
      get('/api/user/me', reqHeaders)
        .then(result => {
          if (result.user && result.user.id) {
            req.session.user = result.user;
            req.session.token = parsedCookie.ucn;
          }

          next();
        }, next);
    } else {
      next();
    }
  } else {
    next();
  }
};
