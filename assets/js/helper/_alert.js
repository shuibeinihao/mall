import $ from 'jquery';
import {CLICK_NAME} from './_tap';

const alertHTML =
  '<div class="ui-dialog-wrapper ui-alert ui-row">' +
  '<div class="ui-row-cell ui-row-cell-middle">' +
  '<div class="ui-dialog">' +
  '<div class="ui-dialog-msg js-msg"></div>' +
  '<div class="ui-dialog-btns js-btns">' +
  '<span class="ui-dialog-button ui-touchable js-dialog-cancel">取消</span>' +
  '<span class="ui-dialog-button ui-touchable js-dialog-ok">确定</span>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>';

let $alertDialog;
const stop = evt => {
  evt.preventDefault();
  evt.stopPropagation();
};

export function alert(options, fn) {
  options = $.extend({msg: '', onebutton: false}, options);
  if (!$alertDialog) {
    $alertDialog = $(alertHTML)
      .find('.js-dialog-cancel')
      .off()
      .on(CLICK_NAME, evt => {
        stop(evt);
        $alertDialog.hide();
      })
      .end()
      .find('.js-dialog-ok')
      .off()
      .on(CLICK_NAME, evt => {
        stop(evt);
        if (fn && typeof fn === 'function') {
          fn();
        }
        $alertDialog.hide();
      })
      .end()
      .appendTo('body');
  }else{
    $alertDialog
      .find('.js-dialog-cancel')
      .off()
      .on(CLICK_NAME, evt => {
        stop(evt);
        $alertDialog.hide();
      })
      .end()
      .find('.js-dialog-ok')
      .off()
      .on(CLICK_NAME, evt => {
        stop(evt);
        if (fn && typeof fn === 'function') {
          fn();
        }
        $alertDialog.hide();
      })
      .end();
  }

  if (options.msg) {
    $alertDialog.hide();
    $alertDialog.find('.js-msg').html(options.msg);
    //当需要一个按钮的时候 隐藏取消按钮
    if (options.onebutton) {
      $alertDialog.find('.js-dialog-cancel').hide();
    }else{
      $alertDialog.find('.js-dialog-cancel').show();
    }
    $alertDialog.show();
  }
}
