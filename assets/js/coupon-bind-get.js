import $ from 'jquery';
import Vue from 'vue';

new Vue({
  el:'#coupon-bind',
  data:{
    productId:'',
    couponId:'',
  },
  created(){
    this.productId = $('.coupon-info-btn').attr('data-productId');
    this.couponId = $('.coupon-info-btn').attr('data-couponId');
  },
  methods:{
    useCoupon(){
      let url = window.location.search.substr(1);
      //h5扫码规则 url上如果有productId 则为一个商品 直接跳转此商品
      // 如果没有productId字段则根据couponId获取适合此优惠券的商品列表
      if(this.productId){
        location.href = '/product/'+ this.productId + '?' + url;
      }else{
        location.href = '/product/coupon-prod-list/?' + url;
      }
    },
  },
});
