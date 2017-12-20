import $ from 'jquery';
import animate from './helper/_animate';
import {toPay} from './helper/_busi';
import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import {CLICK_NAME} from './helper/_tap';//安卓低版本不支持 .on('click',function(){});
import Vue from 'vue';
import request from './request';

new Vue({
  el: '#me',
  data: {
    count: 0,
  },
  methods: {
    getVersion(){
      //点击五次显示版本号
      this.count++;
      if (this.count >= 5) {
        tipInfo('2017/09/18-10-01-01');
        this.count = 0;
      }
    },
    cancelOrder(_id){
      alert({msg: '是否要取消此订单？'}, cancelOrderCall);
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
    confirmReceipt(_id){
      alert({msg: '是否要确认收货?'}, confirmReceiptOk);
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

$('.js-logout').on(CLICK_NAME, () => {
  const $dialog = $('.js-dialog').removeClass('hidden');
  animate($dialog.find('.js-dialog-inner'), 'zoomIn');
});

$('.js-dialog-cancel').on(CLICK_NAME, evt => {
  evt.preventDefault();
  evt.stopPropagation();
  $('.js-dialog').addClass('hidden');
});

$(document)
  .on(CLICK_NAME, '.js-pay', evt => {
    const id = $(evt.target).data('id');
    toPay(id);
  })
  .on(CLICK_NAME, '.js-order-confirm', evt => {
    evt.preventDefault();
    const href = $(evt.target).attr('href');
    $.post(href)
      .then(
        () => location.href = '/gp/me?state=1',
        () => tipInfo('请求出错！')
      );
  });

$('.js-dropdown-list').on(CLICK_NAME, evt => {
  $(evt.currentTarget).toggleClass('show');
});
