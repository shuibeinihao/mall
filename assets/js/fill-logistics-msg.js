import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import {customerPop} from './helper/_customerPop';
import request from './request';
import $ from 'jquery';
import Vue from 'vue';

new Vue({
  el: '#fillLogistics',
  data: {
    id:'',
    subOrderId: '',
    orderId: '',
    type: '',
    created: '',
    expressName: '',//物流名称
    expressCode: '',//物流单号
    contact: '',//联系信息
    otherExpressName: '',//其它物流名称
  },
  created(){
    let urlInfo = window.location.search.substr(1).split('&&');
    for (let i = 0; i < urlInfo.length; i++) {
      if (urlInfo[i].split('=')[0] === 'subOrderId') {
        this.subOrderId = urlInfo[i].split('=')[1];
      } else if (urlInfo[i].split('=')[0] === 'id') {
        this.id = urlInfo[i].split('=')[1];
      }else if (urlInfo[i].split('=')[0] === 'orderId') {
        this.orderId = urlInfo[i].split('=')[1];
      } else if (urlInfo[i].split('=')[0] === 'type') {
        this.type = urlInfo[i].split('=')[1];
      } else if (urlInfo[i].split('=')[0] === 'created') {
        this.created = urlInfo[i].split('=')[1];
      }
    }
    //点击客服按钮显示弹窗
    customerPop();
  },
  methods: {
    selectVar(){
      if (this.expressName === '其它') {
        $('.otherExpressName').fadeIn();
      } else {
        $('.otherExpressName').hide();
      }
    },
    backInfo() {
      location.href = `/gp/order/${this.orderId}`;
    },
    fillLogistics(){
      if (this.expressName === '' && this.expressCode === '') {
        tipInfo('请完善物流信息!');
        return;
      }else if(this.expressName === ''){
        tipInfo('请选择物流名称!');
        return;
      } else if (this.expressName === '其它' && this.otherExpressName === '') {
        tipInfo('请填写物流名称!');
        return;
      } else if (this.expressCode === '') {
        tipInfo('请填写物流单号!');
        return;
      }

      //如果选择其它 物流名称为填写的物流名称
      if(this.otherExpressName){
        this.expressName = this.otherExpressName;
      }

      loadingInfo(true);
      let url = '/api/trade/mall/after-sale-order';
      let data = {
        id:this.id,
        orderId: this.orderId,
        subOrderId: this.subOrderId,
        type: this.type,
        status: 'DELIVERED',
        expressName:this.expressName,
        expressCode:this.expressCode,
        contact:this.contact,
      };
      request(url, data, 'POST')
        .then(res => {
          if (res.success) {
            loadingInfo(false);
            xksTrack.track('MobileMall:Fill_Shipping:Submit',{'state':'success'});
            alert({msg: '提交成功!', onebutton: true},this.backInfo);
          } else {
            loadingInfo(false);
            xksTrack.track('MobileMall:Fill_Shipping:Submit',{'state':'fail'});
            tipInfo(res.retMsg);
          }
        })
        .catch(() => {
          loadingInfo(false);
          tipInfo('网络错误，请稍后重试！');
        });
    }
  },
});





