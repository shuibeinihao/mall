import $ from 'jquery';
import Swiper from 'swiper';
import inputNumberSetup from './helper/_inputNumber';
import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import {customerPop} from './helper/_customerPop';
import {replyEvaluations} from './helper/_replyEvaluations';
import {CLICK_NAME, stopEvent} from './helper/_tap';
import LazyLoad from 'lazyload';
import {ScrollSpy} from 'bootstrap/scrollspy';
import 'jsonlylightbox';
import request from './request';

const options = {
  pagination: '.swiper-pagination',
  loop: true,
  autoplay: 0,
  lazyLoading: true,
  autoplayDisableOnInteraction: false
};

new Swiper('.swiper-container', options);

const $amount = inputNumberSetup('.js-spec-amount');
// let $availableInStock = $('.js-spec-item').attr('data-availableInStock');
const $cartlabel = $('.js-cartlabel');
const $submitBtn = $('.js-spec-submit');
const $itembox = $('#spec-itembox');
const SHOW_TYPE_NONE = 0;
const SHOW_TYPE_CART = 2;
const SHOW_TYPE_PURCHASE = 3;
let currentType = SHOW_TYPE_NONE;

let couponUrl = window.location.search.substr(1);
let productId = $('.goCart').attr('data-productId');

//判断是否登录 如果登录 获取购物车数量
if (usid) {
  request('/api/trade/cart', {}, 'GET')
    .then(res => {
      if (res.items.length) {
        let cartTotalNum = res.snapshot.allNum;
        if (cartTotalNum > 9) {
          $('.js-cartlabel').text('N');
        } else {
          $('.js-cartlabel').text(cartTotalNum);
        }
      } else {
        $('.js-cartlabel').remove();
      }
    })
    .catch((error) => {
      if (error.errorCode === 'NoGuest') {
        $('.js-cartlabel').remove();
      }
    });
} else {
  $('.js-cartlabel').remove();
}

//判断商品是否达到购买等级 如果为立即购买 update确定url
const updateUrl = () => {
  const currentId = $itembox.find('.spec-active').data('id');
  let num = +$amount.val;

  request(`/api/trade/check-buy/${currentId}/${num}`, {}, 'POST')
    .then(res => {
      if (res.success === false) {
        alert({msg: res.retMsg, onebutton: true},()=>{
          location.reload(true);
        });
      }
    })
    .catch(err => {
      let msg = '';
      if (err.errorCode === 'NoGuest') {
        msg = '请先登录';
        alert({msg: msg, onebutton: true}, function () {
          window.location = '/user/login?redirect=' + encodeURIComponent(document.URL);
        });
      } else {
        tipInfo('网络错误，请稍后重试！');
      }
    });
  switch (currentType) {
    case SHOW_TYPE_PURCHASE:
      $submitBtn.attr('href', `/gp/order?p=${currentId}_${num}&&buyRoute=2&&${couponUrl}`);
      //点击a标签跳转时关掉立即购买弹窗 直接执行hideDialog不起作用 如果页面返回刷新修复可以去掉此
      $submitBtn.attr('onclick', 'xksTrack.track(\'MobileMall:Product_Details:Confirm_Buy_Now:Click\',{\'productId\':\''+productId+'\'});$(\'.js-spec-dialog,.js-spec-dialogBg\').hide();$(\'html,body\').css(\'overflow\', \'\');$(\'.js-actions\').show();currentType =' + SHOW_TYPE_NONE + ';mixpanel.track(\'MobileMall: Product Details: Confirm Buy Now: Click\');');
      // sessionStorage.setItem('p', currentId + '_' + num);//先存下来 地址页面回到创建订单页面会用，订单创建成功会删除
      break;
  }
};

$amount.add(updateUrl);

const hideDialog = () => {
  $('.js-spec-dialog,.js-spec-dialogBg').hide();
  $('html,body').css('overflow', '');
  $('.js-actions').show();
  currentType = SHOW_TYPE_NONE;
};
const showDialog = type => {
  $('.js-spec-dialog,.js-spec-dialogBg').show();
  $('html,body').css('overflow', 'hidden');
  $('.js-actions').hide();
  currentType = type;
  updateUrl();
};

//切换规格更新库存 图片 价格等对应信息
const specStock = (_this)=> {
  const $target = _this;

  //切换规格传过去对应的库存和购买限制
  $('.js-amount-dec').removeClass('set-gray');
  $('.js-amount-inc').removeClass('set-gray');
  const availableInStock = $target.attr('data-availableInStock');
  const buyLimit = $target.attr('data-buyLimit');
  if(buyLimit){
    $amount.setMax(availableInStock,buyLimit);
    $amount.updateInputUI();
  }else{
    $amount.setMax(availableInStock);
    $amount.updateInputUI();
  }

  $target.addClass('spec-active').siblings('.spec-active').removeClass('spec-active');
  $('.js-spec-availableInStock').text(availableInStock);
  $('.js-spec .js-spec-price').text($target.data('selling-price'));
  $('.js-price-xinbi').text($target.data('xinbi-price'));
  $('.js-spec-image').attr('src', $target.data('image'));
  $('.js-amount-input').attr('data-max', availableInStock);
  // $availableInStock = availableInStock;
};

//规格选择默认选择不是disabled的第一个规格
$('.js-spec-item').each(function () {
  if (!$(this).hasClass('disabled')) {
    specStock($(this));
    return false;
  }
});

//点击规格
$('.js-spec-item').on(CLICK_NAME, evt => {
  specStock($(evt.target));
  updateUrl();
});

//关闭弹窗
$('.js-spec-close,.js-spec-dialogBg').on(CLICK_NAME, evt => {
  stopEvent(evt);
  hideDialog();
  $('.customer-pop,.iframe-close').hide();//客服弹出框
});

//加入购物车
let isAdding = false;
const addCart = evt => {
  stopEvent(evt);
  if (isAdding) {
    return;
  }
  isAdding = true;
  const n = +$amount.val;
  const addid = $itembox.find('.spec-active').data('id');
  loadingInfo(true);
  request(`/api/trade/add-shopping-cart/${addid}/${n}`, {}, 'POST')
    .then(res => {
      isAdding = false;
      hideDialog();
      loadingInfo(false);
      if (res.success) {
        const currentNum = +$cartlabel.data('number');
        const newNum = currentNum + n;
        $cartlabel.data('number', newNum);
        $cartlabel.text(newNum > 9 ? 'N' : newNum);
        if ($cartlabel.hasClass('hidden')) {
          $cartlabel.show();
        }
        tipInfo('已成功加入购物车');
        location.reload(true);
      } else {
        alert({msg: res.retMsg, onebutton: true});
      }
    })
    .catch(err => {
      loadingInfo(false);
      let msg = '加入购物车出错';
      if (err.errorCode === 'NoGuest') {
        msg = '请先登录';
        isAdding = false;
        hideDialog();
        alert({msg: msg, onebutton: true}, () => {
          window.location = '/user/login?redirect=' + encodeURIComponent(document.URL);
        });
      }
    });
};

$submitBtn.on(CLICK_NAME, evt => {
  //如果是购物车 执行加入购物车接口 如果不是 执行a标签的跳转连接
  if (currentType === SHOW_TYPE_CART) {
    xksTrack.track('MobileMall:Product_Details:Confirm_Add_Cart:Click', {'productId': productId });
    addCart(evt);
  }
});

$(() => {
  // bootstrap scrollspy
  $('body').scrollspy({target: '#navbar-product', offset: 90});

  //vanilla-lazyload
  new LazyLoad();

  var lightbox = new Lightbox();
  // var lightBoxOptions = {
  //   // options
  //   boxId: false,
  //   dimensions: true,
  //   captions: true,
  //   prevImg: false,
  //   nextImg: false,
  //   hideCloseBtn: false,
  //   closeOnClick: true,
  //   loadingAnimation: 200,
  //   animElCount: 4,
  //   preload: true,
  //   carousel: true,
  //   animation: 400,
  //   nextOnClick: true,
  //   responsive: true,
  //   maxImgSize: 0.8,
  //   keyControl: true,
  // }
  lightbox.load();

  $('.js-describe img').css({ //todo:remove these when we use ckEditor5.
    width: '',
    height: ''
  });

  $('.product-swipper-img').click(function(){
    let index = $(this).attr('data-index');
    xksTrack.track('MobileMall:Product_Details:Product_Images:Click', {'imgIndex':index,'productId': productId});
  });
});

//优惠券信息带到购物车
$('.goCart').click(function(){
  location.href = '/gp/cart?' + couponUrl;
});

//锚点平滑移动
$(function () {
  $('.product-nav-top ul li a').click(function () {
    $(this).addClass('active').parent().siblings().find('a').removeClass('active');
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
      if ($target.length) {
        var targetOffset = $target.offset().top - 82;//减掉82是因为头部两个fixed是41px * 2
        $('html,body').animate({
          scrollTop: targetOffset,
        }, 500);
        return false;
      }
    }
  });
});

//点击弹窗编辑窗口
$('.js-to-cart').on(CLICK_NAME, evt => {
  stopEvent(evt);
  xksTrack.track('MobileMall:Product_Details:Add_Cart:Click', {'productId': productId });
  showDialog(SHOW_TYPE_CART);
});
$('.js-to-purchase').on(CLICK_NAME, evt => {
  stopEvent(evt);
  xksTrack.track('MobileMall:Product_Details:Buy_Now:Click', {'productId': productId });
  showDialog(SHOW_TYPE_PURCHASE);
});

//顶部slideBar显示
$('.product-icon').click(function () {
  $('.product-slide-nav').slideToggle();
});

//点击客服按钮显示弹窗
customerPop();

//点击回复按钮回复评论
replyEvaluations();


