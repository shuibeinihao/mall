import $ from 'jquery';
import {toPay} from './helper/_busi';
import {CLICK_NAME} from './helper/_tap';
import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import {customerPop} from './helper/_customerPop';
import Vue from 'vue';
import request from './request';

new Vue({
  el: '#orderDetail',
  data: {
    isReload: '',//用于 created 重绘页面
  },
  created(){
    this.isReload = 'reload';
    let finishTime = $('.data-order-details').attr('data-finish');//收货时间完成时间
    let currTimesD = Date.parse(new Date());//当前时间戳

    //判断申请退还按钮是否显示
    let utcDiffer = currTimesD - finishTime;//时间戳之差
    let secondDiffer = parseInt(utcDiffer / 1000);//发货时间与当前时间相差多少秒
    // 退换货按钮是否显示 大于14天退换都不能
    if (secondDiffer >= parseInt(14 * 24 * 60 * 60)) {
      $('.apply-refund').hide();
    }else{
      $('.apply-refund').show();
    }

    //点击去支付按钮
    $('.js-pay').on(CLICK_NAME, evt => {
      const id = $(evt.target).data('id');
      toPay(id);
    });

    //点击客服按钮显示弹窗
    customerPop();
  },
  methods: {
    cancelOrder(_id){
      alert({msg: '是否确认<br>取消本次订单'}, cancelOrderCall);
      function cancelOrderCall() {
        loadingInfo(true);
        request(`/api/trade/cancel_order/${_id}`, {}, 'GET')
          .then(res => {
            loadingInfo(false);
            if (res.success) {
              tipInfo('此订单已取消');
              location.reload(true);
            }
          })
          .catch(() => {
            loadingInfo(false);
            tipInfo('网络错误，请稍后重试！');
          });
      }
    },
    goPay(_id){
      toPay(_id);
    },
    confirmReceipt(_id){
      alert({msg: '是否确认<br>已收到货物'}, confirmReceiptOk);
      function confirmReceiptOk() {
        loadingInfo(true);
        request(`/api/trade/finish_order/${_id}`, {}, 'GET')
          .then(res => {
            loadingInfo(false);
            if (res.success) {
              tipInfo('已确认收货');
              location.reload(true);
            }
          })
          .catch(() => {
            loadingInfo(false);
            tipInfo('网络错误，请稍后重试！');
          });
      }
    },
    remindDeliver(_id){
      loadingInfo(true);
      request(`/api/trade/reminder_order/${_id}`, {}, 'POST')
        .then(res => {
          loadingInfo(false);
          if (res.success) {
            alert({msg: '提醒成功<br>已提醒卖家', onebutton: true});
          } else {
            alert({msg: res.retMsg, onebutton: true});
          }
        })
        .catch(() => {
          loadingInfo(false);
          tipInfo('网络错误，请稍后重试！');
        });
    },
  },
});
