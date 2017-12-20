import $ from 'jquery';

const $pay = $('.js-order');
const { orderId, weixinObj } = window;

function pay() {
  function callback(res) {
    if (res.err_msg === 'get_brand_wcpay_request:ok') {
      location.href = '/gp/me';
    } else {
      location.href = `/order/pay/weixin?id=${orderId}&state=0&msg=${res.err_desc || '支付失败'}`;
    }
  }

  function appPay() {
    WeixinJSBridge.invoke('getBrandWCPayRequest', weixinObj, callback);
  }

  if (typeof WeixinJSBridge === 'undefined') {
    $(document).one('WeixinJSBridgeReady', appPay);
  } else {
    appPay();
  }
}

if ($pay.length) {
  pay();
}
