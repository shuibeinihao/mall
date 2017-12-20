import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import {customerPop} from './helper/_customerPop';
import request from './request';
import $ from 'jquery';
import Vue from 'vue';

new Vue({
  el: '#afterSaleDetails',
  data: {
    subOrderId: '',
    orderId: '',
    type:'',
  },
  created(){
    let urlInfo = window.location.search.substr(1).split('&&');
    for (let i = 0; i < urlInfo.length; i++) {
      if (urlInfo[i].split('=')[0] === 'subOrderId') {
        this.subOrderId = urlInfo[i].split('=')[1];
      } else if (urlInfo[i].split('=')[0] === 'orderId') {
        this.orderId = urlInfo[i].split('=')[1];
      }
    }
    //点击客服按钮显示弹窗
    customerPop();
  },
  methods: {
    CancelApplication(){
      alert({msg:'撤销申请后，您可再次对商品发<br>起退换申请，是否确定撤销?'},()=>{
        this.type = $('.js-cancel').attr('data-type');
        loadingInfo(true);
        let url = '/api/trade/mall/after-sale-order';
        let data = {
          orderId: this.orderId,
          subOrderId: this.subOrderId,
          type: this.type,
          status: 'CANCEL',
        };
        request(url, data, 'POST')
          .then(res => {
            if (res.success) {
              loadingInfo(false);
              tipInfo('撤销成功');
              location.href = `/gp/order/${this.orderId}`;
            } else {
              loadingInfo(false);
              tipInfo(res.retMsg);
            }
          })
          .catch(() => {
            loadingInfo(false);
            tipInfo('网络错误，请稍后重试！');
          });
      });
    }
  },
});





