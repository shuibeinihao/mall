import $ from 'jquery';

const alertHTML =
'<div class="ui-dialog-wrapper ui-alert ui-row">'+
'<div class="ui-row-cell ui-row-cell-middle">' +
'<span class="loadingtip-msg js-msg" style="padding:1rem;border-radius: 5px;">' +
'<div class="spinner">'+
  '<div class="spinner-container container1">'+
  '<div class="circle1"></div>'+
  '<div class="circle2"></div>'+
  '<div class="circle3"></div>'+
  '<div class="circle4"></div>'+
  '</div>'+
  '<div class="spinner-container container2">'+
  '<div class="circle1"></div>'+
  '<div class="circle2"></div>'+
  '<div class="circle3"></div>'+
  '<div class="circle4"></div>'+
  '</div>'+
  '<div class="spinner-container container3">'+
  '<div class="circle1"></div>'+
  '<div class="circle2"></div>'+
  '<div class="circle3"></div>'+
  '<div class="circle4"></div>'+
  '</div>'+
  '</div>'+
'</span>' +
  '</div>' +
'</div>';

let $alertDialog;

const createAlertDialog = () =>
  $(alertHTML).appendTo('body');

export function loadingInfo(isShow) {

  if (!$alertDialog) {
    $alertDialog = createAlertDialog();
  }
  if(isShow){
    $alertDialog.fadeIn();
  }else{
    $alertDialog.hide();
  }
}
