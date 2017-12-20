import $ from 'jquery';
import inputNumberSetup from './helper/_inputNumber';
import {alert} from './helper/_alert';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import {CLICK_NAME} from './helper/_tap';
import Vue from 'vue';
import request from './request';

new Vue({
  el: '#cart',
  data: {
    isSwipe: [],//产品删除按钮是否显示
    isEdit: false,//是否在编辑状态
    isEditText: '编辑',
    currIntegral: '',//用户当前积分
    isIntegral: false,//当用户没有积分的时候 不显示
    isCartEdit: false, //是否显示编辑状态布局
  },
  created(){
    this.cartNumShow();//x3  显示购物车单个商品数量
    request('/api/userscore/get-user-score', {}, 'GET')
      .then(res => {
        if (res.scoreEarned) {
          this.currIntegral = res.scoreEarned;
          this.isIntegral = true;
        }
      })
      .catch(() => {
        tipInfo('网络错误，请稍后重试！');
      });
  },
  methods: {
    cartNumShow(){
      let cartFillInput = $('.data-cartNum');
      cartFillInput.each(function(index,element){
        $('.cartNumInfo'+index).html($(element).val());
      });
    },
    cart_edit(){
      if(this.isEdit === true){
        $('.js-cart-info').fadeIn();
        $('.cart-delect-wrap').hide();
        this.isEditText = '编辑';
        this.cartNumShow();
        this.isEdit = false;
      }else{
        $('.js-cart-info').hide();
        $('.cart-delect-wrap').fadeIn();
        this.isEditText = '完成';
        this.isEdit = true;
      }
    },
    clearFailureProd(evt){
      stop(evt);
      let cartFailureIds = $('.cartFailureIds').attr('data-cartFailureIds');
      let cartFailureIdsInfo =  cartFailureIds.split(',');
      let idsInfo = [];
      for(let i = 0; i< cartFailureIdsInfo.length; i++){
        idsInfo.push(parseInt(cartFailureIdsInfo[i]));
      }
      alert({msg:'是否要清空失效商品？'},()=>{
        loadingInfo(true);
        request('/api/trade/cart/items', idsInfo, 'POST')
          .then(res => {
            loadingInfo(false);
            if (res.success) {
              tipInfo('失效商品删除成功！');
              setTimeout(()=>{
                location.reload();
              },1000);
            }
          })
          .catch(() => {
            loadingInfo(false);
            tipInfo('网络错误，请稍后重试！');
          });
      });

    },
  },
});

const stop = evt => {
  evt.preventDefault();
  evt.stopPropagation();
};

let couponUrl = window.location.search.substr(1);//优惠券信息

let $check = $('.js-check');
let isDel = false;//是否是删除商品
const $checkAll = $('.js-check-all');
const $delbtn = $('.js-delbtn');
const $total = $('.js-total');
const $score = $('.js-score');
const $topurchase = $('.js-to-purchase');
const isAllChecked = () => $check.filter(':not(.checked)').length === 0;
const hasChecked = () => $check.filter('.checked').length > 0;

let flag = 0;//控制model.hasAmountUpdate判断只执行一次

let model = {
  hasChecked: false,
  isAllChecked: false,
  hasAmountUpdate: false, //数量是否有更新
};

const updateForwarding = () => {
  let total = 0;
  let score = 0;
  let selected = [];
  $check.filter('.checked').each(function () {
    const $self = $(this);
    const id = $self.data('id');
    const specid = $self.data('specid');
    const $amount = $(`#amount_${id}`);
    const amount = $amount.data('amountObj').val;
    selected.push(`${specid}_${amount}`);
    total += parseInt(amount) * parseFloat($amount.data('price'));
    score += parseInt(amount) * parseFloat($amount.data('score'));
  });
  $total.text(Number(total).toFixed(2));
  $score.text(Number(score));
  $topurchase.on(CLICK_NAME, evt => {
    stop(evt);
    if (model.hasChecked) {
      mixpanel.track('MobileMall: Cart: SubmitBtn: Click');
      xksTrack.track('MobileMall:Shopping_Cart:SubmitBtn:Click');
      location.href = `/gp/order?p=${selected.join('|')}&&buyRoute=1&&${couponUrl}`;
    } else {
      tipInfo('未选择商品');
      return false;
    }
  });
  if (flag == 0) {
    if (!model.hasAmountUpdate) {
      flag = 1;
      update();
    } else {
      saveEdit();
    }
  }
};

$(updateForwarding);//初始化状态更新

const amountUpdate = () => {
  model.hasAmountUpdate = true;
  flag = 0;
  updateForwarding();
};

//初始化input为1情况处理
$('.js-amount').each(function () {
  const amountObj = inputNumberSetup(this);
  amountObj.add(amountUpdate);//监听事件变化
  $(this).data('amountObj', amountObj);
});

const update = () => {
  const needCheckAll = model.isAllChecked;
  $checkAll.toggleClass('checked', needCheckAll);
  $delbtn.prop('disabled', !model.hasChecked);
  updateForwarding();
};

const saveEdit = (_id,isDel = false) => {
  const params = [];
  const $col = isDel ? $check.filter('.checked') : $check;
  $col.each(function () {
    const $self = $(this);
    const id = $self.data('id');
    const $amount = $(`#amount_${id}`);
    const amount = +$amount.data('amountObj').val;
    params.push({
      deleted: isDel,
      shoppingCart: {
        id, num: +amount
      }
    });
  });

  request('/api/trade/update-shopping-cart', params, 'PUT')
    .then(res => {
      if (res.success) {
        if (!res.data.filter(item => !!item.productSpecification).length) {
          location.reload(true);
          return;
        }
        if (isDel) {
          model.hasChecked = false;
          model.isAllChecked = false;
          $col.closest('.js-prod').remove();
        } else {
          model.hasAmountUpdate = false;
        }
      } else {
        alert({msg: res.retMsg, onebutton: true});
      }
    })
    .catch(() => {
      tipInfo('网络错误，请稍后重试！');
    });
};

$checkAll.on(CLICK_NAME, evt => {
  stop(evt);
  const next = !model.isAllChecked;
  model.isAllChecked = next;
  model.hasChecked = next;
  $check.toggleClass('checked', next);
  update();
});

$check.on(CLICK_NAME, evt => {
  stop(evt);

  const $self = $(evt.currentTarget);
  const next = !$self.hasClass('checked');
  $self.toggleClass('checked', next);

  if (next) {
    model.hasChecked = true;
    model.isAllChecked = isAllChecked();
  } else {
    model.isAllChecked = false;
    model.hasChecked = hasChecked();
  }
  update();
});

$delbtn.on(CLICK_NAME, evt => {
  let productId = $(evt.target).attr('data-productId');
  xksTrack.track('MobileMall:Shopping_Cart:Delete:Click', {'productId': productId});
  alert({msg: '您确定要删除此商品吗？'}, delectProduct);
  function delectProduct() {
    let id = $(evt.target).attr('data-id');
    isDel = true;
    const params = [];
    const $amount = $(`#amount_${id}`);
    const amount = $amount.data('amountObj').val;
    params.push({
      deleted: isDel,
      shoppingCart: {
        id, num: +amount
      }
    });
    loadingInfo(true);
    request('/api/trade/update-shopping-cart', params, 'PUT')
      .then(res => {
        loadingInfo(false);
        if (res.success) {
          tipInfo('删除成功！');
          if (!res.data.filter(item => !!item.productSpecification).length) {
            location.reload(true);
            return;
          }
          if (isDel) {
            model.hasChecked = false;
            model.isAllChecked = false;
            $(evt.target).closest('.js-prod').remove();
            $check = $('.js-check');
            location.reload(true);
          } else {
            model.hasAmountUpdate = false;
          }
        }
      })
      .catch(() => {
        loadingInfo(false);
        tipInfo('网络错误，请稍后重试！');
      });
  }
});

