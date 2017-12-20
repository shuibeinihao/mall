module.exports = () => (req, res) => {
  // res.status(404).send('Not find!');
  res.render('404.njk');

  // const err = new Error('Not Found');
  // err.status = 404;
  // next(err);
};
