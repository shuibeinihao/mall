let express = require('express');

const router = express.Router();

router.get('/insurance', (req, res) => {
  res.render('insurance.valentine.njk', {
    appClass: 'app-ins',
    baiduStats: true
  });
});

router.get('/buy-bracelet', (req, res) => {
  res.redirect(process.env.BRACELET_URL);
});

module.exports = router;
