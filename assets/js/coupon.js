import $ from 'jquery';
import Vue from 'vue';

const stop = evt => {
  evt.preventDefault();
  evt.stopPropagation();
};

new Vue({
  el: '#coupon',
  data: {
    couponId: '',
    productSpecification: '',//url获取的产品规格
    couponInfo: '',
    buyRoute: '',//1 购物车购买 2立即购买
    addressId: '',//默认地址id
  },
  created(){
    let couponUrl = window.location.search.substr(1).split('&&');//是否要回到创建订单页
    for (let i = 0; i < couponUrl.length; i++) {
      if (couponUrl[i].split('=')[0] === 'p') {
        this.productSpecification = couponUrl[i].split('=')[1];
      } else if (couponUrl[i].split('=')[0] === 'couponId') {
        this.couponId = couponUrl[i].split('=')[1];
      } else if (couponUrl[i].split('=')[0] === 'buyRoute') {
        this.buyRoute = couponUrl[i].split('=')[1];
      }else if (couponUrl[i].split('=')[0] === 'addressId') {
        this.addressId = couponUrl[i].split('=')[1];
      }
    }
    //根据couponId选中目标优惠券
    $('.coupon_default').each((index,element)=>{
      if($(element).attr('data-id') === this.couponId){
        $(element).addClass('coupon_checked');
      }
    });
  },
  methods: {
    //点击地址跳转到order页面
    getCoupon(evt){
      stop(evt);
      $(evt.target).toggleClass('coupon_checked').parent().parent().parent().siblings().find('.coupon_default').removeClass('coupon_checked');
    },
    couponOkBtn(){
      let p = this.productSpecification;
      let buyRoute = this.buyRoute;
      let addressId = this.addressId;
      if($('.coupon_default').length > 0){
        $('.coupon_default').each(function () {
          const $self = $(this);
          let selectCoupon = '';
          if($self.hasClass('coupon_checked')){
            let id = $self.attr('data-id');
            let sign = $self.attr('data-sign').toString();
            let money = $self.attr('data-money');
            let name = $self.attr('data-name');
            let productId = $self.attr('data-productId');
            selectCoupon = 'couponId='+ id + '&' + 'sign='+ sign + '&'+ 'money='+ money + '&'+ 'name='+ name + '&' + 'productId=' + productId;
            location.href = '/gp/order?p=' + p + '&&buyRoute=' + buyRoute + '&&addressId=' + addressId +  '&&' + selectCoupon;
            return false;
          }else{
            selectCoupon = 'couponId=null' + '&' + 'sign=null' + '&'+ 'money='+ '0.00' + '&'+ 'name='+ '不使用优惠券' + '&' + 'productId=null';
            location.href = '/gp/order?p=' + p + '&&buyRoute=' + buyRoute + '&&addressId=' + addressId +  '&&' + selectCoupon;
          }
        });
      }else{
        location.href = '/gp/order?p=' + p + '&&buyRoute=' + buyRoute + '&&addressId=' + addressId;
      }
    },
    couponTab(evt){
      stop(evt);
      $(evt.target).addClass('act').siblings().removeClass('act');
      let index = $('.tab-info').index(evt.target);
      $('.coupon-con-list').eq(index).fadeIn().siblings().hide();
    },
  },
});

