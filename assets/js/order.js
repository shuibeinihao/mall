import $ from 'jquery';
import {toPay} from './helper/_busi';
import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import request from './request';
import Vue from 'vue';

new Vue({
  el: '#order',
  data: {
    count: 0,
    orderAddress: {},
    isAddress: true,
    msg: '',//备注信息
    selected: '不开发票',//发票类型
    companyName: '',//公司名称name发票信息
    addressId: '',//地址id
    productId: [],//产品所有id
    type: 0,//类型 1 个人 2 企业 0不开
    postage: '0',//邮费
    currIntegral: '0',//用户当前积分
    isIntegral: false,//当用户没有积分的时候 不显示
    userNeedScore: '0',//购买商品所需积分
    userNeedPrice: '0',//商品的价格
    couponMoney: '0.00',//优惠券金额
    couponId: '',//优惠券id
    couponSign: '',//优惠券标识
    totalMoney: '0',//总额 加上运费 减去优惠券
    couponList: {},//优惠券列表
    couponName: '无可用优惠券',//优惠券名称
    productSpecification: '',//跳转至选择优惠券页面商品规格
    writeReceipt: 0,//0不支持开发票 1 全部商品支持开发票 2有包含的商品支持开发票
    couponInfo: '',//当前优惠券信息
    taxpayerNum: '',//纳税人识别号
    buyRoute: '',//1 购物车过来 2 立即购买过来
    isSubmit: false,//是否可以提交
  },
  created(){
    let _this = this;
    //获取是否是包含可以开发票的商品
    _this.writeReceipt = $('.order-product').attr('data-writeReceipt');
    //获取订单所需支付心币
    _this.userNeedScore = $('.order-score').attr('data-score');
    //获取订单需支付的价格
    _this.userNeedPrice = $('.order-price').attr('data-price');
    //获取商品规格信息
    // 处理url
    let couponId = '', addressId = '';
    let orderUrl = window.location.search.substr(1).split('&&');
    for (let i = 0; i < orderUrl.length; i++) {
      if (orderUrl[i].split('=')[0] === 'couponId') {
        this.couponInfo = orderUrl[i];
      } else if (orderUrl[i].split('=')[0] === 'p') {
        this.productSpecification = orderUrl[i].split('=')[1];
      } else if (orderUrl[i].split('=')[0] === 'addressId') {
        addressId = orderUrl[i].split('=')[1];
      } else if (orderUrl[i].split('=')[0] === 'buyRoute') {
        this.buyRoute = orderUrl[i].split('=')[1];
      }
    }
    if (this.couponInfo) {
      let couponInfoArr = this.couponInfo.split('&');
      for (let i = 0; i < couponInfoArr.length; i++) {
        if (couponInfoArr[i].split('=')[0] === 'couponId') {
          couponId = couponInfoArr[i].split('=')[1];
        }
      }
    }

    let pid = '';
    let productMap = {};
    if (this.productSpecification) {
      pid = this.productSpecification.split('|');
      pid.forEach(item => {
        for (let i = 0; i < item.split('_')[1]; i++) {
          _this.productId.push(item.split('_')[0]);
        }
      });
      for (let i = 0; i < pid.length; i++) {
        let key = pid[i].split('_')[0];
        let value = pid[i].split('_')[1];
        productMap[key] = value;
      }
    }

    // 获取优惠券列表
    //优惠券逻辑
    // 过滤掉不可用优惠券
    // 获取优惠券列表判断是否有可用优惠券如果没有提示无可用优惠券如果有
    // 判断url上有没有couponId如果有判断是否为空如果不为空判断列表里面有没有此优惠券信息如果有显示没有提示几张
    // 如果为空或者url上没有couponid提示几张
    request('/api/trade/coupon', _this.productId, 'POST', false)
      .then(res => {
        if (res.length) {
          _this.couponList = res;
          let couponArr = [];
          for (let i = 0; i < _this.couponList.length; i++) {
            if (_this.couponList[i].usable !== false) {
              couponArr.push(_this.couponList[i]);
            }
          }
          if (couponArr.length > 0) {
            if (couponId && couponId !== 'null') {
              // console.log('url有couponId并且不等于null');
              for (let i = 0; i < couponArr.length; i++) {
                if (couponArr[i].coupon.id == couponId) {
                  _this.couponId = couponArr[i].coupon.id;
                  _this.couponMoney = couponArr[i].couponGroup.money;
                  _this.couponSign = couponArr[i].coupon.sign;
                  _this.couponName = couponArr[i].couponGroup.name;
                  return false;
                } else {
                  // console.log('url有couponId优惠券列表没有对应的优惠券');
                  //获取优惠券中最大的和对应的id sign
                  _this.couponName = `${couponArr.length}张可用`;
                }
              }
            } else if (couponId === 'null') {
              // console.log('url有couponID为空null');
              _this.couponName = `${couponArr.length}张可用`;
            } else {
              // console.log('url上没有couponId');
              //获取优惠券中最大的和对应的id sign
              _this.couponName = `${couponArr.length}张可用`;
            }
          } else {
            // console.log('无可用优惠券');
          }
        }
      })
      .catch(() => {
        tipInfo('网络错误，请稍后重试！');
      });


    //判断是从地址列表过来的 还是购物车过来的
    if (addressId) {
      _this.addressId = addressId;
      let url = `/api/trade/address/${_this.addressId}`;
      request(url, {}, 'GET', false)
        .then(res => {
          if (res.success && res.data) {//此处返回的是对象
            _this.orderAddress = res.data;
            $('.order-no-address').hide();
            $('.order-have-address').show();
            getPostage(_this.addressId);//根据地址id获取邮费
          } else {
            $('.order-no-address').show();
            $('.order-have-address').hide();
          }
        })
        .catch(() => {
          $('.order-no-address').show();
          $('.order-have-address').hide();
        });
    } else {
      request('/api/trade/list-address', {}, 'GET', false)
        .then(res => {
          if (res.success && res.data.length) {
            _this.orderAddress = res.data[0];
            _this.addressId = _this.orderAddress.id;
            _this.isAddress = false;//新建地址是否显示
            $('.order-no-address').hide();
            $('.order-have-address').show();
            getPostage(_this.addressId);
          } else {
            $('.order-no-address').show();
            $('.order-have-address').hide();
          }
        })
        .catch(() => {
          tipInfo('网络错误，请稍后重试！');
        });
    }

    function getPostage(_addressId) {
      request(`/api/trade/mall/calc-postage?addressId=${_addressId}`, productMap, 'POST')
        .then(res => {
          _this.isSubmit = true;
          if (res.success) {
            _this.postage = res.data;
            //合计user应付的总额
            if (!_this.userNeedPrice) {
              _this.userNeedPrice = 0;
            }
            if (parseFloat(_this.userNeedPrice) >= parseFloat(_this.couponMoney)) {
              _this.totalMoney = (_this.userNeedPrice - _this.couponMoney + _this.postage).toFixed(2);
            } else {
              alert({msg: '优惠券不能抵扣运费,只能抵扣商品金额整数部分哦！', onebutton: true});
              _this.totalMoney = (parseFloat('0.' + parseFloat(_this.userNeedPrice).toFixed(2).split('.')[1]) + _this.postage).toFixed(2);
            }
          } else {
            tipInfo(res.retMsg);
          }
        })
        .catch(() => {
          tipInfo('网络错误，请稍后重试！');
        });
    }

    // 获取个人当前积分
    request('/api/userscore/get-user-score', {}, 'GET')
      .then(res => {
        if (res.scoreEarned) {
          _this.currIntegral = res.scoreEarned;
          _this.isIntegral = true;
        }
      })
      .catch(() => {
        tipInfo('网络错误，请稍后重试！');
      });

  },
  methods: {
    selectVal(ele){
      this.type = ele.target.value;
      if (this.type === '2') {
        $('.js-company').fadeIn();
      } else {
        $('.js-company').fadeOut();
      }
    },
    goCouponSelect(){
      location.href = `/gp/coupon?p=${this.productSpecification}&&addressId=${this.addressId}&&buyRoute=${this.buyRoute}&&couponId=${this.couponId}`;
    },
    getVersion(){
      //点击五次显示版本号
      this.count++;
      if (this.count >= 5) {
        tipInfo('2017/09/18-10-01-01');
        this.count = 0;
      }
    },
    addAddress(){
      location.href = '/gp/address?orderPage=' + true + '&&p=' + this.productSpecification + '&&buyRoute=' + this.buyRoute + '&&' + this.couponInfo;
    },
    orderAddressEdit(){
      location.href = '/gp/addresslist?p=' + this.productSpecification + '&&buyRoute=' + this.buyRoute + '&&' + this.couponInfo;
    },
    submitOrder(){
      if (this.addressId === '') {
        tipInfo('请完善收货地址');
        return;
      } else if (this.type === '2') {
        if (this.companyName === '') {
          tipInfo('请输入公司抬头');
          return;
        }
        if (this.taxpayerNum === '') {
          tipInfo('请输入纳税人识别号');
          return;
        }
      }
      var _this = this;

      function createdOrder() {
        loadingInfo(true);
        let data = {};
        data = {
          addressId: _this.addressId,
          note: _this.msg,
          productSpecificationIds: _this.productId,
          receiptTitle: _this.companyName,
          receiptFlag: _this.type,
          couponId: _this.couponId,
          sign: _this.couponSign,
          taxpayerIdentificationNumber: _this.taxpayerNum,
          buyRoute: _this.buyRoute,
        };
        request('/api/trade/create-porder', data, 'POST')
          .then(res => {
            if (res.success) {
              loadingInfo(false);
              mixpanel.track('MobileMall: Confirm Order: SubmitBtn: Click', {'state': '@"success"}'});
              xksTrack.track('MobileMall:Confirm_Order:SubmitBtn:Submit', {'state': 'success'});
              if (res.data.alipayUrl) {
                tipInfo('订单提交成功！');//付钱
                toPay(res.data.pOrder.id, res.data.alipayUrl);
              } else if (res.data.pOrder.state === 12) {
                tipInfo('订单提交成功！');//新币
                location.href = '/gp/heartcodeok?state=12';
              } else if (res.data.pOrder.state === 1) {
                tipInfo('订单提交成功！');//虚拟商品
                location.href = '/gp/heartcodeok?state=1';
              }
            } else {
              loadingInfo(false);
              tipInfo(res.retMsg);
              mixpanel.track('MobileMall: Confirm Order: SubmitBtn: Click', {'state': '@"fail"}'});
              xksTrack.track('MobileMall:Confirm_Order:SubmitBtn:Submit', {'state': 'fail'});
            }
          })
          .catch(() => {
            loadingInfo(false);
            tipInfo('网络错误，请稍后重试！');
          });
      }

      //判断是否是只需要使用心币支付
      if(_this.isSubmit === true){
        if (this.totalMoney > 0) {
          //判断开发票情况下 是否为多个商品包含可以开发票的情况
          if (this.type !== '0' && this.writeReceipt === '2') {
            alert({msg: '所选商品中只有部分商品<br>可以开发票'}, createdOrder);
          } else {
            createdOrder();
          }
        } else {
          if (this.isIntegral === true && parseInt(this.userNeedScore) > parseInt(this.currIntegral)) {
            alert({msg: '心币不足', onebutton: true});
          } else if (parseInt(this.userNeedScore) === 0) {
            createdOrder();
          } else {
            alert({msg: `是否确认扣除${this.userNeedScore}心币`}, createdOrder);
          }
        }
      }else{
        // console.log('不能点击');
      }
    },
    showChoose(){
      $('#order-list').fadeIn();
      $('#app').addClass('noscroll');
    },
    hideChooser(){
      $('#order-list').fadeOut();
      $('#app').removeClass('noscroll');
    },
  },
});

