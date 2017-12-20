import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import {customerPop} from './helper/_customerPop';
import request from './request';
import $ from 'jquery';
import Vue from 'vue';

new Vue({
  el: '#updateLogistics',
  data: {
    id:'',
    subOrderId: '',
    orderId: '',
    type: '',
    code: '',
    expressName: '',//物流名称
    expressCode: '',//物流单号
    contact: '',//联系信息
    otherExpressName: '',//其它物流名称
  },
  created(){
    let urlInfo = window.location.search.substr(1).split('&&');
    for(let i=0; i<urlInfo.length; i++){
      if(urlInfo[i].split('=')[0] === 'code'){
        this.code = urlInfo[i].split('=')[1];
      }
    }
    let url = `/api/trade/mall/after-sale-order/${this.code}`;
    request(url, {}, 'GET')
      .then(res => {
        this.expressCode = res.expressCode;
        this.contact = res.contact;
        this.type = res.type;
        this.id = res.id;
        this.orderId = res.orderId;
        this.subOrderId = res.subOrderId;
        // 修改物流 原物流信息
        let logisticsName = ['顺丰速运','圆通快递','申通快递','韵达快递','中通快递','德邦快递','京东快递','EMS','百世快递','天天快递','宅急送快递','如风达','优速快递','全峰快递','全一快递','UPS','DHL','FedEx'];
        if(logisticsName.indexOf(res.expressName) !== -1){
          this.expressName = res.expressName;
          $('.otherExpressName').hide();
        }else{
          this.expressName = '其它';
          $('.otherExpressName').show();
          this.otherExpressName = res.expressName;
        }
      })
      .catch(() => {
        tipInfo('网络错误，请稍后重试！');
      });

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
      location.href = `/gp/after-sale-details/?code=${this.code}&&orderId=${this.orderId}&&subOrderId=${this.subOrderId}`;
    },
    updateLogistics(){
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

      if(this.expressName === '其它'){
        //如果选择其它 物流名称为填写的物流名称
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
            xksTrack.track('MobileMall:Change_Shipping:Submit',{'state':'success'});
            alert({msg: '提交成功!', onebutton: true},this.backInfo);
          } else {
            loadingInfo(false);
            xksTrack.track('MobileMall:Change_Shipping:Submit',{'state':'fail'});
            tipInfo(res.retMsg);
          }
        })
        .catch(() => {
          loadingInfo(false);
          tipInfo('网络错误，请稍后重试！');
        });
    },
    cancelUpdateLogistics(){
      this.backInfo();
    },
  },
});





