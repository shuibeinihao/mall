import $ from 'jquery';
import { CLICK_NAME } from './_tap';
import {tipInfo} from './_tipInfo';

//参考 http://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery
export function filterInputNumber($input) {
  $input.keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||

    // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||

    // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }

    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
}

const MAX_AMOUNT = 20;//购物车允许输入的最大数值
class Amount {
  constructor(selector) {
    this.amount = $(selector);
    const callbacks = $.Callbacks();
    const $input = this.amount.find('.js-amount-input');
    filterInputNumber($input);
    let $limit = +this.amount.find('.js-amount-input').attr('data-limit');
    const max = +$input.data('max');
    this.minNum = MAX_AMOUNT;

    if($limit){
      this.minNum = Math.min(max, MAX_AMOUNT, $limit);
      $input.data('max', this.minNum);
    }else{
      this.minNum = Math.min(max, MAX_AMOUNT);
      $input.data('max', this.minNum);
    }

    const setInputValue = (val) => {
      let newVal = val;
      if(val < 1){
        newVal = 1;
        tipInfo('商品不能再减少了哦～');
      }else if(val > this.minNum){
        newVal = this.minNum;
        tipInfo('商品不能购买更多了哦～');
      }
      $input.val(newVal);
      callbacks.fire(newVal);
    };

    $input.on('change blur', evt => {
      evt.preventDefault();
      evt.stopPropagation();
      const v = +$input.val();

      setInputValue(v);
      this.updateInputUI();
    });

    this.amount.find('.js-amount-dec').on(CLICK_NAME, evt => {
      evt.stopPropagation();
      evt.preventDefault();
      const v = +$input.val();

      setInputValue(v-1);
      this.updateInputUI();
    });

    this.amount.find('.js-amount-inc').on(CLICK_NAME, evt => {
      evt.stopPropagation();
      evt.preventDefault();
      const v = +$input.val();

      setInputValue(v+1);
      this.updateInputUI();
    });

    this.updateInputUI();

    this._input = $input;
    this._callbacks = callbacks;
  }

  updateInputUI() {
    const val = +this.amount.find('.js-amount-input').val();
    //js-amount-dec
    if (val < 2) {
      this.amount.find('.js-amount-dec').addClass('set-gray');
    } else {
      this.amount.find('.js-amount-dec').removeClass('set-gray');
    }
    //js-amount-inc
    if (val >= this.minNum) {
      this.amount.find('.js-amount-inc').addClass('set-gray');
    } else {
      this.amount.find('.js-amount-inc').removeClass('set-gray');
    }
  }

  get val() {
    return this._input.val();
  }
  //
  // set val(v) {
  //   const max = this._input.data('max');
  //   if (v > max) {
  //     v = max;
  //   }
  //
  //   if (v < 1) {
  //     v = 1;
  //   }
  //
  //   this._input.val(v);
  //   this._callbacks.fire(v);
  // }
  //
  // set max(m) {
  //   m = Math.min(m, MAX_AMOUNT);
  //   const v = this._input.val();
  //   if (v > m) {
  //     this._input.val(m);
  //     this._callbacks.fire(m);
  //   }
  //   this._input.data('max', m);
  // }
  //
  // get max() {
  //   return this._input.data('max');
  // }

  add(fn) {
    this._callbacks.add(fn);
  }
  //此处为切换规格时 比较库存 最大值 以及 购买限制Todo
  setMax(m,limit){
    if(limit){
      m = Math.min(m, MAX_AMOUNT, limit);
    }else{
      m = Math.min(m, MAX_AMOUNT);
    }

    this.minNum = m;

    const v = this._input.val();
    if (v > m) {
      this._input.val(m);
      this._callbacks.fire(m);
    }
    this._input.data('max', m);
  }
}

export default function setup(selector) {
  return new Amount(selector);
}
