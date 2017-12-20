module.exports = function () {
  return function (req, res, next) {
    if (!req.session.token) {
      req.session.redirect = req.originalUrl;
      res.redirect('/user/login');
      return;
    } else {
      const nocache =
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0';
      res.append('Cache-Control', nocache);
      next();
    }
  };
};
