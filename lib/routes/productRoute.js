let express = require('express');
let mapGet = require('../mapGet');
let httpRequest = require('../httpRequest');
let mapRequest = require('../mapRequest');

const router = express.Router();
const PAGE_SIZE = 20;
router.get('/tags/:tagId', (req, res, next) => {
  const {tagId} = req.params;
  mapGet(req, {
    products: `/api/trade/mall/list-product-by-tag?tagId=${tagId}&size=200`,
  }).then(result => {
    if (result.products.success) {
      res.render('gp/tags.njk', {
        cssFiles: [],
        query: tagId,
        jsFiles: ['tags'],
        appClass: '',
        data: result.products,
      });
    } else {
      next(new Error(result.homeData.success ? result.products.retMsg : result.homeData.retMsg));
    }
  })
    .catch(err => next(JSON.stringify(err)));
});

router.get('/coupon-prod-list', (req, res, next) => {
  const {couponId, sign, money, bind} = req.query;
  const couponUrl = 'couponId=' + couponId + '&sign=' + sign + '&money=' + money + '&bind=' + bind;
  let _map = {
    products: {
      url: `/api/trade/coupon/${couponId}/product?offset=0&size=200`,
      method: 'GET',
      body: {},
    },
    couponInfo: {
      url: `/api/trade/coupon/${couponId}/group`,
      method: 'GET',
      body: {},
    }
  };
  mapRequest(req, _map)
    .then((result) => {
      //app点击去使用优惠券规则：始终跳转至此页面 如果接口返回商品为一个 则直接跳转至此商品 如果为多个渲染列表
      if (result.products.length === 1) {
        res.redirect(`/product/${result.products[0].product.id}?${couponUrl}`);
      } else {
        res.render('gp/coupon-prod-list.njk', {
          cssFiles: [],
          jsFiles: ['coupon-prod-list'],
          appClass: '',
          couponUrl: couponUrl.toString(),
          data: result.products,
          couponName: result.couponInfo.name,
          couponId: result.couponInfo.id,
        });
      }
    })
    .catch(err => next(JSON.stringify(err)));
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  //判断是否为CS角色只有CS角色才能回复
  let isComment = false;
  if(req.session.user){
    let userType = req.session.user.type;
    if(userType === 'CS'){
      isComment = true;
    }
  }
  mapGet(req, {
    product: `/api/trade/product/${id}`
  }).then(result => {
    if (result.product.success) {
      let availableInStock = 0;//总库存
      result.product.data.productDetail.productSpecificationList.forEach(item => {
        availableInStock += item.availableInStock;
      });
      res.render('gp/product.njk', {
        cssFiles: [
          '../../vendor/swiper/dist/css/swiper.min',
          '../../vendor/jsonlylightbox/css/lightbox.min'
        ],
        jsFiles: ['product'],
        appClass: 'product',
        baiduStats: true,
        isComment,
        availableInStock: availableInStock,
        xksJsBridgeAppNavBtn: {showShareBtn: true},
        xksJsBridgeOnShareCommon: {
          title: '心开始商城',
          desc: result.product.data.productDetail.product.name,
          imgUrl: result.product.data.productDetail.product.imgList[0]
        },
        CONTACT_US: process.env.CONTACT_US,
        productDetail: result.product.data.productDetail,
        commentUserBeans: result.product.data.commentUserBeans
      });
    } else {
      next(new Error(result.product.success ? result.cart.retMsg : result.product.retMsg));
    }
  }, err => next(
    JSON.stringify(err)
  ));
});

router.get('/evaluations/:id', (req, res, next) => {
  const page = (req.query.page && +req.query.page > 1) ? +req.query.page : 1;
  const offset = (page - 1) * PAGE_SIZE;
  const hasPicture = req.query.haspicture || 2;//2:全部 1:有图 0:无图
  const {id} = req.params;
  //判断是否为CS角色只有CS角色才能回复
  let isComment = false;
  if(req.session.user){
    let userType = req.session.user.type;
    if(userType === 'CS'){
      isComment = true;
    }
  }
  httpRequest(req, `/api/trade/comment/list-comment-user/${id}?hasPicture=${hasPicture}&offset=${offset}&size=${PAGE_SIZE}`)
    .then(response => {
      res.render('gp/evaluations.njk', {
        cssFiles: ['evaluations','../../vendor/jsonlylightbox/css/lightbox.min'],
        jsFiles: ['evaluations'],
        commentUserBeans: response,
        hasPicture,
        isComment,
        pageInfo: {total: response.total, offset: response.offset, size: response.size},
      });
    }, next);
});

module.exports = router;
