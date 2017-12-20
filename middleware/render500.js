module.exports = () => (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.render('500.njk', {errorMessage: (req.app.get('env') === 'development' || req.app.get('env') === 'local') ? err.stack : null});
};
