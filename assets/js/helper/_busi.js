import $ from 'jquery';
import { isWeixin } from './_util';

export function toPay(orderId, alipayUrl) {
  if (isWeixin) { //微信里面可选择微信支付
    //location.href = `/order/pay/${orderId}`;
    location.href = `/api/trade/go-wechat-auth/${orderId}`;
  } else {
    if (alipayUrl) {
      $('body').append(alipayUrl);
    } else {
      $.get(`/api/trade/get-alipay-url/${orderId}`, result => {
        $('body').append(result.data);
      });
    }
  }
}
