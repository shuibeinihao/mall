import $ from 'jquery';

const alertHTML =
  '<div class="ui-dialog-wrapper ui-alert ui-row">' +
'<div class="ui-row-cell ui-row-cell-middle">' +
      '<span class="loadingtip-msg js-msg"></span>' +
    '</div>' +
'</div>';

let $alertDialog;

const createAlertDialog = () =>
  $(alertHTML).appendTo('body');

export function tipInfo(msg) {

  if (!$alertDialog) {
    $alertDialog = createAlertDialog();
  }

  $alertDialog.find('.js-msg').html(msg);
  $alertDialog.fadeIn();
  setTimeout(()=>{
    $alertDialog.fadeOut();
  },2000);
}
