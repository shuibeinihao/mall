define(["jquery","vue"],function(o,t){"use strict";o="default"in o?o.default:o,new(t="default"in t?t.default:t)({el:"#coupon-bind",data:{productId:"",couponId:""},created:function(){this.productId=o(".coupon-info-btn").attr("data-productId"),this.couponId=o(".coupon-info-btn").attr("data-couponId")},methods:{useCoupon:function(){var o=window.location.search.substr(1);this.productId?location.href="/product/"+this.productId+"?"+o:location.href="/product/coupon-prod-list/?"+o}}})});
