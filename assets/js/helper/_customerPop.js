import $ from 'jquery';

export function customerPop(){
  $('.js-customer').click(function () {
    let url = $('.customer-pop').attr('data-url');
    $('.customer-pop iframe').attr('src', url);
    $('.js-spec-dialogBg,.customer-pop,.iframe-close').show();
  });

  $('.js-spec-dialogBg,.iframe-close').click(function () {
    $('.js-spec-dialogBg,.customer-pop,.iframe-close').hide();//客服弹出框
  });
}

