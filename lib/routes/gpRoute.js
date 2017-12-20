let express = require('express');
let area = require('./a.json');
let mapGet = require('../mapGet');
let mapRequest = require('../mapRequest');
let httpRequest = require('../httpRequest');
let groupBy = require('lodash.groupby');
let values = require('lodash.values');
let fetch = require('node-fetch');
let cookie = require('cookie');

const router = express.Router();

const states = {
  10: '待支付',
  12: '支付成功',
  [-11]: '支付失败',
  [-12]: '支付超时',
  20: '请求退款',
  21: '退款处理中',
  22: '退款成功',
  [-21]: '退款失败',
  [-22]: '退款超时',
  30: '已发货',
  [-40]: '已关闭'
};

router.get('/cart', (req, res, next) => {
  httpRequest(req, '/api/trade/shopping-cart')
    .then(result => {
      if (result.success) {
        let list = result.data.filter(item => !!item.productSpecification);
        let cartAble = [];//可购买商品
        let cartFailureIds = [];//失效商品shopcartid（等级不够，库存不够，积分不够，等等）
        let cartFailure = [];//失效商品
        list.forEach(item => {
          if (item.valid === true) {
            cartAble.push(item);
          } else if (item.valid === false) {
            cartFailure.push(item);
            cartFailureIds.push(item.shoppingCart.id);
          }
        });
        res.render('gp/cart.njk', {
          cssFiles: [],
          jsFiles: ['cart'],
          appClass: 'cart',
          data: list,
          cartFailure: cartFailure,
          cartAble: cartAble,
          cartFailureIds: cartFailureIds,
        });
      } else {
        next(new Error(result.retMsg));
      }
    }, next);
});

router.get('/order', (req, res, next) => {
  const {p} = req.query;
  if (!/^\d+_\d+(\|\d+_\d+)*$/.test(p)) {
    res.sendStatus(400);
    return;
  }

  const claims = {};//商品规格和个数键值对
  const ids = [];//规格数组
  let count = [];//个数数组
  let totalCount = 0;//商品总数目

  p.split('|').forEach(item => {
    item = item.split('_');
    claims[item[0]] = +item[1];
    ids.push(+item[0]);
    count.push(item[1]);
  });

  for (var key in claims) {
    totalCount += claims[key];
  }

  const _map = {
    listProduct: {
      url: '/api/trade/list-product-specification',
      method: 'POST',
      body: ids
    }
  };

  mapRequest(req, _map)
    .then(result => {
      if (result.listProduct.success) {
        let sum = {};//总金额 总心币 是否包邮
        let writeReceiptArr = [];
        sum.price = 0;
        sum.score = 0;
        sum.freeFreight = true;
        sum.totalCount = totalCount;//总共几件
        sum.writeReceipt = 0;//全部false为0 全部为true为1 包含true为2
        result.listProduct.data.forEach(item => {
          sum.price += item.productSpecification.sellingPrice * claims[item.productSpecification.id];
          sum.score += item.productSpecification.scorePrice * claims[item.productSpecification.id];
        });
        result.listProduct.data.forEach(item => {
          if (item.product.freeFreight === false) {
            sum.freeFreight = false;
            return false;
          } else {
            sum.freeFreight = true;
          }
        });
        result.listProduct.data.forEach(item => {
          writeReceiptArr.push(item.product.writeReceipt);
        });

        //判断包含开发票信息
        const isTrue = (arr) => {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === true) {
              return true;
            }
          }
        };

        const isFalse = (arr) => {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === false) {
              return false;
            }
          }
        };

        if (isTrue(writeReceiptArr) === true && isFalse(writeReceiptArr) === false) {
          sum.writeReceipt = 2;
        } else if (isTrue(writeReceiptArr) === true) {
          sum.writeReceipt = 1;
        } else if (isFalse(writeReceiptArr) === false) {
          sum.writeReceipt = 0;
        }
        //有几个商品
        for (let i = 0; i < result.listProduct.data.length; i++) {
          result.listProduct.data[i].product.count = count[i];
        }
        res.render('gp/order.njk', {
          cssFiles: [],
          jsFiles: ['order'],
          area,
          appClass: '',
          query: req.query,
          claims,
          count,
          list: result.listProduct.data,
          sum: sum,
          baiduStats: true
        });
      } else {
        next(new Error(result.retMsg));
      }
    }, next);
});

router.get('/delivery/:orderId', (req, res, next) => {
  const {orderId} = req.params;
  if (!orderId) {
    res.sendStatus(404);
    return;
  }

  httpRequest(req, `/api/trade/porder/${orderId}`)
    .then(response => {
      if (response.success) {
        res.render('gp/orderDelivery.njk', {
          cssFiles: [],
          jsFiles: ['orderDetail'],
          appClass: 'order app-delivery',
          order: response.data
        });
      } else {
        next(new Error(response.retMsg));
      }
    }, next);
});

// 子订单-----
//state=1       申请售后
//state=50      换货审核中 status=APPLY
//state=20      退货审核中 status=APPLY
//state=-23     退货取消   status=CANCEL
//state=-53     换货取消   status=CANCEL
//state=110     退货待寄回商品  从新获取了售后订单信息自定义的 数字 status=AGREE
//state=120     换货待寄回商品  从新获取了售后订单信息自定义的 数字 status=AGREE
//state=-110    退货一审失败  从新获取了售后订单信息自定义的 数字 status=REFUSE
//state=-120    换货一审失败  从新获取了售后订单信息自定义的 数字 status=REFUSE
//state=51      换货处理中  status=DELIVERED
//state=21      退货处理中  status=DELIVERED
//state=-51     换货失败    status=FAIL
//state=-21     退货失败    status=FAIL
//state=52      换货完成    status=DONE
//state=22      退货完成    status=DONE
//售后订单----------------
//type=RETURN   退货
//type=BARTER   换货
//status=APPLY  申请售后
//status=REFUSE 拒绝申请
//status=CANCEL 取消申请
//status=AGREE  同意申请 待寄回商品
//status=DELIVERED  已发货 退换货处理中
//status=FAIL   售后失败
//status=DONE   售后成功
router.get('/order/:orderId', (req, res, next) => {
  const {orderId} = req.params;
  if (!orderId) {
    res.sendStatus(404);
    return;
  }
  let subOrderIds = [];
  httpRequest(req, `/api/trade/porder/${orderId}`)
    .then(result => {
      result.data.pOrderSubList.forEach(item => {
        subOrderIds.push(item.pOrderSub.id);
      });
      httpRequest(req, `/api/trade/mall/after-sale-order/${orderId}`, 'POST', JSON.stringify(subOrderIds))
        .then(response => {
          result.data.pOrderSubList.forEach(item => {
            if (response[item.pOrderSub.id]) {
              item.pOrderSub.code = response[item.pOrderSub.id].code;
              if (response[item.pOrderSub.id].status === 'AGREE' && response[item.pOrderSub.id].type === 'RETURN') {
                item.pOrderSub.state = 110;//退货待寄回商品
              } else if (response[item.pOrderSub.id].status === 'AGREE' && response[item.pOrderSub.id].type === 'BARTER') {
                item.pOrderSub.state = 120;//换货待寄回商品
              } else if (response[item.pOrderSub.id].status === 'REFUSE' && response[item.pOrderSub.id].type === 'RETURN') {
                item.pOrderSub.state = -110;//退货一审失败
              } else if (response[item.pOrderSub.id].status === 'REFUSE' && response[item.pOrderSub.id].type === 'BARTER') {
                item.pOrderSub.state = -120;//换货一审失败
              }
            }
          });

          if (result.success) {
            res.render('gp/orderDetail.njk', {
              cssFiles: [],
              jsFiles: ['orderDetail'],
              appClass: '',
              CONTACT_US: process.env.CONTACT_US,
              xksJsBridgeAppNavBtn: {showCustomerServiceBtn: true},
              order: result.data,
              products: values(groupBy(result.data.pOrderSubList, item => item.pOrderSub.productSpecificationId)),
            });
          } else {
            next(new Error(response.retMsg));
          }
        }, next);
    }, next);
});

const ORDER_STATE_UNPAY = 10; //未支付
const ORDER_STATE_UNPOST = 12; //待发货
const ORDER_STATE_UNRECEIVE = 30; //待收货
const ORDER_STATE_FINISH = 1; //已完成
const ORDER_STATE_ALL = 0;
router.get('/me', (req, res, next) => {
  let {state} = req.query;
  state = parseInt(state);
  if (isNaN(state)) {
    state = 0;//不传默认是全部
  }

  mapGet(req, {
    order: `/api/trade/list-porder?state=${state}`//todo:分页
  }).then(resultMap => {
    const result = resultMap.order;
    if (result.success) {

      if (!result.data.length && req.query.autoredirect == 1) {
        res.redirect('/');
        return;
      }

      let list = result.data;
      let counts = {
        [ORDER_STATE_ALL]: 0,
        [ORDER_STATE_UNPAY]: 0,
        [ORDER_STATE_UNPOST]: 0,
        [ORDER_STATE_UNRECEIVE]: 0,
        [ORDER_STATE_FINISH]: 0,
      };
      list.forEach(item => {
        switch (item.pOrder.state) {
          case ORDER_STATE_UNPAY: //'待支付',
            counts[ORDER_STATE_UNPAY]++;
            break;
          case ORDER_STATE_UNPOST: //'支付成功',
            counts[ORDER_STATE_UNPOST]++;
            break;
          case ORDER_STATE_UNRECEIVE: //'已发货',
            counts[ORDER_STATE_UNRECEIVE]++;
            break;
          case ORDER_STATE_FINISH:  // 已完成
            counts[ORDER_STATE_FINISH]++;
            break;
        }
      });

      // state为0时是全部
      list = state === 0 ?
        list
          .filter(item => item.pOrder.state !== 0)
          .map(item => {
            item.products = values(groupBy(item.pOrderSubList, subItem => subItem.pOrderSub.productSpecificationId));
            return item;
          })
        : list
          .filter(item => item.pOrder.state === state)
          .map(item => {
            item.products = values(groupBy(item.pOrderSubList, subItem => subItem.pOrderSub.productSpecificationId));
            return item;
          });

      let goCommit = false;//默认不显示评价 1为换货完成之后生成的0元订单 false:至少有一个可以评价 true:都已评价
      list.forEach(item => {
        if (item.pOrder.type === 1 && item.pOrder.state === 1) {
          for (let i = 0; i < item.pOrderSubList.length; i++) {
            if (item.pOrderSubList[i].haveComment === false) {
              goCommit = false;
              return false;
            } else {
              goCommit = true;
            }
          }
        } else {
          goCommit = 1;//0元订单
        }
        item.pOrder.goCommit = goCommit;
      });

      res.render('gp/me.njk', {
        cssFiles: [],
        jsFiles: ['me'],
        appClass: '',
        states,
        currentState: state,
        counts,
        countsIds: [ORDER_STATE_ALL, ORDER_STATE_UNPAY, ORDER_STATE_UNPOST, ORDER_STATE_UNRECEIVE, ORDER_STATE_FINISH],
        countsText: {
          [ORDER_STATE_ALL]: '全部',
          [ORDER_STATE_UNPAY]: '待付款',
          [ORDER_STATE_UNPOST]: '待发货',
          [ORDER_STATE_UNRECEIVE]: '待收货',
          [ORDER_STATE_FINISH]: '已完成',
        },
        orderList: list
      });
    }
    else {
      next(new Error(result.retMsg));
    }
  }, next);
});

router.get('/returned', (req, res, next) => {
  let {orderId, subOrderId, code, type} = req.query;
  let afterSaleType = [];//售后可选的类型
  let _map;
  const isApply = !code;
  if (code) {
    //修改售后时 获取售后明细
    _map = {
      updateAfterSale: {
        url: `/api/trade/mall/after-sale-order/${code}`,
        method: 'GET',
        body: {},
      }
    };
  } else {
    //申请售后 获取支持哪些售后
    _map = {
      isAfterSaleAble: {
        url: `/api/trade/mall/after-sale-order-type/${orderId}/${subOrderId}`,
        method: 'GET',
        body: {},
      }
    };
  }

  mapRequest(req, _map)
    .then(result => {
      //如果是修改申请 不能修改类型 之能修改原因
      let disableSelect = false;//当可选售后类型小于等于一个时 select不可选
      let onlyOneType;//只有一个售后类型时显示一个售后类型
      if (result.updateAfterSale) {
        //只有修改售后url才有type
        afterSaleType.push(type);
        onlyOneType = type;
      } else {
        afterSaleType = afterSaleType.concat(result.isAfterSaleAble);
        if (afterSaleType.length === 1) {
          onlyOneType = afterSaleType[0];
        }
      }
      if (afterSaleType.length <= 1) {
        disableSelect = true;
      }
      res.render('gp/returned.njk', {
        cssFiles: [],
        jsFiles: ['returned'],
        appClass: '',
        isApply,
        disableSelect: disableSelect,
        onlyOneType: onlyOneType,
        data: result.updateAfterSale,
        afterSaleType: afterSaleType,
        CONTACT_US: process.env.CONTACT_US,
        xksJsBridgeAppNavBtn: {showCustomerServiceBtn: true},
      });
    }, next);
});

router.get('/evaluate/:orderSubId', (req, res, next) => {
  const {orderSubId} = req.params;
  if (!orderSubId) {
    res.sendStatus(404);
    return;
  }

  httpRequest(req, `/api/trade/order-sub/${orderSubId}`)
    .then(result => {
      if (result.success) {
        res.render('gp/evaluate.njk', {
          cssFiles: [],
          jsFiles: ['evaluate'],
          appClass: '',
          order: result.data,
          pOrderSubList: values(groupBy(result.data.pOrderSubList, item => item.pOrderSub.productSpecificationId)),
        });
      } else {
        next(new Error(result.retMsg));
      }
    }, next);
});

router.get('/address', (req, res) => {
  let {addressId} = req.query;
  let title = '新建收货地址';
  if (addressId) {
    title = '编辑收货地址';
  }
  res.render('gp/address.njk', {
    cssFiles: [],
    jsFiles: ['address'],
    appClass: '',
    title: title,
    area,
  });
});

router.get('/addresslist', (req, res, next) => {
  httpRequest(req, '/api/trade/list-address')
    .then(result => {
      if (result.success) {
        const list = result.data;
        res.render('gp/addresslist.njk', {
          cssFiles: [],
          jsFiles: ['addresslist'],
          appClass: '',
          data: list,
        });
      } else {
        next(new Error(result.retMsg));
      }
    }, next);
});

router.get('/coupon-download', (req, res, next) => {
  const {couponId, sign} = req.query;
  let data = {
    id: couponId,
    sign: sign,
  };
  httpRequest(req, '/api/trade/coupon-bind', 'POST', JSON.stringify(data))
    .then(result => {
      res.render('gp/coupon-download.njk', {
        cssFiles: [],
        jsFiles: [],
        appClass: '',
        data: result,
      });
    }, next);
});

//todo remove 比httpRequest多一个参数{token: tokenInfo}
function post(req, url, data, headers = {}) {
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
      _version: process.env.API_VERSION, //版本号
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: cookie.serialize('ucn', req.session.token)
    }, headers),
    body: JSON.stringify(data)
  })
    .then(checkStatus);
}

router.get('/coupon-bind-get', (req, res, next) => {
  const {couponId, sign, productId} = req.query;
  const tokenInfo = req.session.token;
  let data = {
    id: couponId,
    sign: sign,
  };

  post(req, '/api/trade/coupon-bind', data, {token: tokenInfo})
    .then(result => {
      res.render('gp/coupon-bind-get.njk', {
        cssFiles: ['coupon-bind-get'],
        jsFiles: ['coupon-bind-get'],
        appClass: '',
        data: result,
        productId: productId,
        couponId: couponId,
      });
    }, next);
});

router.get('/coupon', (req, res, next) => {
  let {p} = req.query;
  if (!/^\d+_\d+(\|\d+_\d+)*$/.test(p)) {
    res.sendStatus(400);
    return;
  }

  let ids = [];
  p.split('|').forEach(item => {
    item = item.split('_');
    ids.push(item[0]);
  });
  httpRequest(req, '/api/trade/coupon', 'POST', JSON.stringify(ids))
    .then(result => {
      let userAble = [];
      let unuserAble = [];
      for (let i = 0; i < result.length; i++) {
        const date = new Date(result[i].couponGroup['startTime']);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        result[i].couponGroup['startTime'] = year + '.' + ('0' + month).substr(-2) + '.' + ('0' + day).substr(-2);

        const dateEnd = new Date(result[i].couponGroup['endTime']);
        const yearEnd = dateEnd.getFullYear();
        const monthEnd = dateEnd.getMonth() + 1;
        const dayEnd = dateEnd.getDate();
        result[i].couponGroup['endTime'] = yearEnd + '.' + ('0' + monthEnd).substr(-2) + '.' + ('0' + dayEnd).substr(-2);
        if (result[i].usable === true) {
          userAble.push(result[i]);
        } else {
          unuserAble.push(result[i]);
        }
      }
      res.render('gp/coupon.njk', {
        cssFiles: [],
        jsFiles: ['coupon'],
        appClass: '',
        data: result,
        userAble: userAble,
        unuserAble: unuserAble
      });

    }, next);
});

router.get('/carddetails/:orderId', (req, res, next) => {
  const {orderId} = req.params;
  if (!orderId) {
    res.sendStatus(404);
    return;
  }
  httpRequest(req, `/api/trade/porder/${orderId}`)
    .then(response => {
      if (response.success) {
        let currTimesD = Date.parse(new Date());//当前时间戳
        for (let i = 0; i < response.data.pOrderSubList.length; i++) {
          let DATA = response.data.pOrderSubList[i].virtualProductCode;
          let dateStart = new Date(DATA['expiryStartDate']);
          let yearStart = dateStart.getFullYear();
          let monthStart = dateStart.getMonth() + 1;
          let dayStart = dateStart.getDate();
          DATA['expiryStartDate'] = yearStart + '.' + ('0' + monthStart).substr(-2) + '.' + ('0' + dayStart).substr(-2);
          let dateEnd = new Date(DATA['expiryEndDate']);
          let yearEnd = dateEnd.getFullYear();
          let monthEnd = dateEnd.getMonth() + 1;
          let dayEnd = dateEnd.getDate();
          if (currTimesD > DATA['expiryEndDate']) {
            DATA['isExpiry'] = true;
          } else {
            DATA['isExpiry'] = false;
          }
          DATA['expiryEndDate'] = yearEnd + '.' + ('0' + monthEnd).substr(-2) + '.' + ('0' + dayEnd).substr(-2);
        }
        res.render('gp/carddetails.njk', {
          cssFiles: [],
          jsFiles: ['carddetails'],
          appClass: '',
          order: response.data,
          products: values(groupBy(response.data.pOrderSubList, item => item.pOrderSub.productSpecificationId)),
        });
      } else {
        next(new Error(response.retMsg));
      }
    }, next);
});

//退换货明细
router.get('/after-sale-details', (req, res, next) => {
  let {code} = req.query;
  httpRequest(req, `/api/trade/mall/after-sale-order/${code}`)
    .then(result => {
      const list = result;
      res.render('gp/after-sale-details.njk', {
        cssFiles: [],
        jsFiles: ['after-sale-details'],
        appClass: '',
        data: list,
        CONTACT_US: process.env.CONTACT_US,
        xksJsBridgeAppNavBtn: {showCustomerServiceBtn: true},
      });
    }, next);
});

//退换货进度
router.get('/after-sale-progress', (req, res, next) => {
  let {orderId, subOrderId, status} = req.query;
  httpRequest(req, `/api/trade/mall/after-sale-order/${orderId}/${subOrderId}`)
    .then(result => {
      let nickName = req.session.user.info.nickName;
      result.forEach(item => {
        let userId = item.userId;
        item.logs = item.logs.reverse();
        for (let i = 0; i < item.logs.length; i++) {
          if (item.logs[i].userId === userId) {
            item.logs[i].nickName = nickName;
          } else {
            item.logs[i].nickName = '心开始';
          }
        }
      });
      res.render('gp/after-sale-progress.njk', {
        cssFiles: [],
        jsFiles: [''],
        appClass: '',
        data: result,
        status,
      });
    }, next);
});

//填写物流信息
router.get('/fill-logistics-msg', (req, res) => {
  let {updated, type} = req.query;
  res.render('gp/fill-logistics-msg.njk', {
    cssFiles: [],
    jsFiles: ['fill-logistics-msg'],
    appClass: '',
    updated: updated,
    type: type,
    CONTACT_US: process.env.CONTACT_US,
    xksJsBridgeAppNavBtn: {showCustomerServiceBtn: true},
  });
});

//修改物流信息
router.get('/update-logistics-msg', (req, res) => {
  res.render('gp/update-logistics-msg.njk', {
    cssFiles: [],
    jsFiles: ['update-logistics-msg'],
    appClass: '',
    CONTACT_US: process.env.CONTACT_US,
    xksJsBridgeAppNavBtn: {showCustomerServiceBtn: true},
  });
});

router.get('/heartcodeok', (req, res) => {
  let {state} = req.query;
  res.render('gp/heartcodeok.njk', {
    cssFiles: [],
    jsFiles: ['heartcodeok'],
    appClass: '',
    state: state,
  });
});
module.exports = router;
