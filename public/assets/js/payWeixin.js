define(["jquery"],function(e){"use strict";e="default"in e?e.default:e;var i=e(".js-order"),n=window,r=n.orderId,d=n.weixinObj;i.length&&function(){function i(e){"get_brand_wcpay_request:ok"===e.err_msg?location.href="/gp/me":location.href="/order/pay/weixin?id="+r+"&state=0&msg="+(e.err_desc||"支付失败")}function n(){WeixinJSBridge.invoke("getBrandWCPayRequest",d,i)}"undefined"==typeof WeixinJSBridge?e(document).one("WeixinJSBridgeReady",n):n()}()});
