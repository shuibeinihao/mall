import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import {customerPop} from './helper/_customerPop';
import request from './request';
import $ from 'jquery';
import Vue from 'vue';

new Vue({
  el: '#returned',
  data: {
    type: '',//type RETURN 退货 BARTER 换货 选择了退货还是换货 7天内退货 14天内换货
    subOrderId: '',//子订单id
    orderId: '', //父订单id
    retMsg: '',//原因
    code: '',
  },
  created(){
    let type = $('.returned-select').attr('data-type');//只有一个售后类型时才能取到
    let reason = $('.returned-textarea').attr('data-retMsg');
    if(type){
      this.type = type;
    }
    if(reason){
      this.retMsg = reason;
    }
    //进入页面的时候根据id获取一次接口 获取可否退货 如果超出退货期 直接隐藏退货按钮
    let urlInfo = window.location.search.substr(1).split('&&');
    for (let i = 0; i < urlInfo.length; i++) {
      if (urlInfo[i].split('=')[0] === 'subOrderId') {
        this.subOrderId = urlInfo[i].split('=')[1];
      } else if (urlInfo[i].split('=')[0] === 'orderId') {
        this.orderId = urlInfo[i].split('=')[1];
      } else if (urlInfo[i].split('=')[0] === 'code') {
        this.code = urlInfo[i].split('=')[1];
      }
    }
    //点击客服按钮显示弹窗
    customerPop();
  },
  methods: {
    selectVar(ele){
      this.type = $(ele.target).val();
    },
    backInfo() {
      window.history.back();
    },
    returned_btn(_isApply){
      if (this.type) {
        if (this.retMsg) {
          loadingInfo(true);
          let url = '/api/trade/mall/after-sale-order';
          let data = {
            orderId: this.orderId,
            subOrderId: this.subOrderId,
            reason: this.retMsg,
            type: this.type,
            status: 'APPLY',
          };
          request(url, data, 'POST')
            .then(res => {
              if (res.success) {
                loadingInfo(false);
                if(_isApply === true){
                  xksTrack.track('MobileMall:Apply_After_Sale:Submit',{'state':'success'});
                }else{
                  xksTrack.track('MobileMall:Change_After_Sale:View',{'state':'success'});
                }
                alert({msg: '提交成功!', onebutton: true},()=>{
                  location.href = `/gp/order/${res.data.orderId}`;
                });
              } else {
                loadingInfo(false);
                if(_isApply === true){
                  xksTrack.track('MobileMall:Apply_After_Sale:Submit',{'state':'fail'});
                }else{
                  xksTrack.track('MobileMall:Change_After_Sale:View',{'state':'fail'});
                }
                tipInfo(res.retMsg);
              }
            })
            .catch(() => {
              loadingInfo(false);
              tipInfo('网络错误，请稍后重试！');
            });
        }else{
          tipInfo('请填写售后原因!');
        }
      } else {
        tipInfo('请选择售后类型!');
      }
    },
  },
});

