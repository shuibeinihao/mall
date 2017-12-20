import $ from 'jquery';
import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import Vue from 'vue';
import request from './request';

const stop = evt => {
  evt.preventDefault();
  evt.stopPropagation();
};

new Vue({
  el: '#addresslist',
  data: {
    isSwipe: [],
    couponInfo: '',
    buyRoute: '',//1 购物车购买 2立即购买
  },
  created(){
    setTimeout(() => {
      // 判断是否存在信息列表
      let $delete_div = $('.delete_div');
      if ($delete_div.length) {
        $delete_div.each((index, element) => {
          let x, y, X, Y, swipeX, swipeY;
          // 监听touchstart
          let lengthinfo = $delete_div.length;
          element.addEventListener('touchstart', e => {
            x = e.changedTouches[0].pageX;
            y = e.changedTouches[0].pageY;
            swipeX = true;
            swipeY = true;
            var index = lengthinfo;
            let arr = [];
            for (let i = 0; i < index; i++) {
              arr[i] = false;
            }
            this.isSwipe = arr;
          });
          element.addEventListener('touchmove', e => {
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;
            if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
              // 阻止默认事件
              e.stopPropagation();
              // 右滑
              if (X - x > 10) {
                e.preventDefault();
                this.isSwipe.splice(index, 1, false);
              }
              if (x - X > 10) {
                e.preventDefault();
                this.isSwipe.splice(index, 1, true);
              }
              swipeY = false;
            }
            if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
              swipeX = false;
            }
          });
        });
      }
    }, 1000);
    let addressListUrl = window.location.search.substr(1).split('&&');//是否要回到创建订单页
    for (let i = 0; i < addressListUrl.length; i++) {
      if (addressListUrl[i].split('=')[0] === 'p') {
        this.productSpecification = addressListUrl[i].split('=')[1];
      } else if (addressListUrl[i].split('=')[0] === 'couponId') {
        this.couponInfo = addressListUrl[i];
      } else if (addressListUrl[i].split('=')[0] === 'buyRoute') {
        this.buyRoute = addressListUrl[i].split('=')[1];
      }
    }
  },
  methods: {
    //点击编辑地址
    editAddress(_id, evt=event){
      stop(evt);
      location.href = '/gp/address?addressId=' + _id + '&&p=' + this.productSpecification + '&&buyRoute=' + this.buyRoute + '&&' + this.couponInfo;
    },
    addNewAddress(){
      location.href = '/gp/address?p=' + this.productSpecification + '&&buyRoute=' + this.buyRoute + '&&' + this.couponInfo;
    },
    //点击地址跳转到order页面
    getAddress(_id){
      // sessionStorage.setItem('addressId', _id);
      // let p = sessionStorage.getItem('p');
      location.href = '/gp/order?addressId=' + _id + '&&p=' + this.productSpecification + '&&buyRoute=' + this.buyRoute + '&&' + this.couponInfo;
    },
    setAddressDefault(_id, _isDefault, evt){
      stop(evt = event);
      loadingInfo(true);
      let addressinfo = JSON.parse($(evt.target).attr('data-id'));
      if (_isDefault == 1) {
        loadingInfo(false);
        tipInfo('已经是默认地址了哦！');
        return;
      }
      let data = {
        address: addressinfo.address,
        city: addressinfo.city,
        district: addressinfo.district,
        isDefault: 1,
        name: addressinfo.name,
        phoneNumber: addressinfo.phoneNumber,
        province: addressinfo.province,
        id: addressinfo.id,
      };
      request('/api/trade/update-address', data, 'PUT')
        .then(res => {
          if (res.success) {
            loadingInfo(false);
            tipInfo('默认地址设置成功!');
            location.reload(true);
          }
        })
        .catch(() => {
          loadingInfo(false);
          tipInfo('网络错误，请稍后重试！');
        });
    },
    delectAddress(_id, evt){
      alert({msg: '是否要删除这条地址？'}, delectAddressF);
      stop(evt = event);
      function delectAddressF() {
        let url = `/api/trade/delete-address/${_id}`;
        request(url, {}, 'DELETE')
          .then(res => {
            if (res.success) {
              tipInfo('删除成功！');
              $(evt.target).parent().remove();
              if ($('.delete_div').length === 0) {
                this.addressId = '';//没有地址列表所以要清除
              }
              location.reload(true);
            }
          })
          .catch(() => {
            tipInfo('网络错误，请稍后重试！');
          });
      }
    },
  },
});


//ios不支持向左滑动删除  所以增加长安删除
var time = 0;
$('.delete_div').on('touchstart', function (e) {
  e.stopPropagation();
  let _id = $(this).attr('data-id');

  function delectAddressF() {
    let url = `/api/trade/delete-address/${_id}`;
    request(url, {}, 'DELETE')
      .then(res => {
        if (res.success) {
          tipInfo('删除成功！');
        }
      }).catch(() => {
        tipInfo('网络错误，请稍后重试！');
      });
  }

  time = setTimeout(function () {
    alert({msg: '是否要删除这条地址？'}, delectAddressF);
  }, 500);//这里设置长按响应时间
});
$('.delete_div').on('touchend', function (e) {
  e.stopPropagation();
  clearTimeout(time);
});

