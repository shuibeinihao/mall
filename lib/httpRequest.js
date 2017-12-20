let fetch = require('node-fetch');
let cookie = require('cookie');

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return response.json()
      .then(res => Promise.reject(res));
  }
}

module.exports = function (req, url, method = 'GET', body) {
  url = url.replace(/^\/api/, process.env.API_MYKAISHI);
  return fetch(url, {
    method,
    headers: {
      _version: process.env.API_VERSION, //版本号
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookie.serialize('ucn', req.session.token)
    },
    body
  })
    .then(checkStatus)
    .then(res => res.json());
};
