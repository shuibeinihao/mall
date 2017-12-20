module.exports = function () {
  return function (req, res, next) {
    if (req.session && req.session.token) {
      res.locals.usid = req.session.user.id;
    }

    next();
  };
};
