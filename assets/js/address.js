import $ from 'jquery';
import areaFormat from './helper/_areaFormat';
import {tipInfo} from './helper/_tipInfo';
import {loadingInfo} from './helper/_loading';
import request from './request';
import area from '../../lib/routes/a.json';

/* 地址 */
let addressinfo = {
    address: '',
    city: '',
    district: '',
    name: '',
    phoneNumber: '',
    province: '',
  },//新建地址需提交信息
  id = '',//地址id
  isDefault = '0',//是否为默认地址1默认0不默认
  addressPcd = '<span class="add-select">--请选择--</span>',//页面显示省市区
  productSpecification = '',//商品规格
  orderPage = '',//是否要调回创建订单页
  couponInfo = '',//优惠券信息
  buyRoute = '',//1 购物车购买 2立即购买
  cityDom = '',
  areaDom = '';


let addressUrl = window.location.search.substr(1).split('&&');//是否要回到创建订单页
for (let i = 0; i < addressUrl.length; i++) {
  for (let i = 0; i < addressUrl.length; i++) {
    if (addressUrl[i].split('=')[0] === 'addressId') {
      id = addressUrl[i].split('=')[1];
    } else if (addressUrl[i].split('=')[0] === 'orderPage') {
      orderPage = addressUrl[i].split('=')[1];
    } else if (addressUrl[i].split('=')[0] === 'p') {
      productSpecification = addressUrl[i].split('=')[1];
    } else if (addressUrl[i].split('=')[0] === 'couponId') {
      couponInfo = addressUrl[i];
    } else if (addressUrl[i].split('=')[0] === 'buyRoute') {
      buyRoute = addressUrl[i].split('=')[1];
    }
  }
}
if (id) {
  let url = `/api/trade/address/${id}`;
  request(url, {}, 'GET')
    .then(res => {
      if (res.success) {
        addressinfo.address = res.data.address;
        addressinfo.city = res.data.city;
        addressinfo.district = res.data.district;
        addressinfo.name = res.data.name;
        addressinfo.phoneNumber = res.data.phoneNumber;
        addressinfo.province = res.data.province;
        let pcd = areaFormat(addressinfo.province, addressinfo.city, addressinfo.district);
        addressPcd = pcd;
        isDefault = res.data.isDefault;
        fillInfo();
      }
    }).catch(() => {
      tipInfo('网络错误，请稍后重试！');
    });
}

function fillInfo() {
  $('#whoEl').val(addressinfo.name);
  $('#telEl').val(addressinfo.phoneNumber);
  $('.addressPcd').html(addressPcd);
  $('#addressEl').val(addressinfo.address);
}

let html = '';
for (var a in area) {
  html += '<li class="ui-list-item no-bottom">';
  html += '<div class="ui-list-item arrow-right ui-touchable js-city js-action">' + a + '</div>';
  html += '<ul class="ui-list order-area-indent hidden">';
  html += '</ul>';
  html += '</li>';
}
$('.order-area-list').append(html);

$(document).on('click', '.js-city', (e = event) => {
  cityDom = '';
  let text = $(e.target).html();
  for (let b in area[text]) {
    cityDom += '<li class = "ui-list-item no-bottom" >';
    cityDom += '<div class = "ui-list-item arrow-right ui-touchable js-area js-action" >' + b + '</div>';
    cityDom += '<ul  class = "ui-list order-area-indent2 hidden" >';
    cityDom += '</ul>';
    cityDom += '</li>';
  }
  $(e.target).toggleClass('open')
    .next().html(cityDom)
    .toggleClass('hidden')
    .prev()
    .get(0).scrollIntoView();
})
  .on('click', '.js-area', (e = event) => {
    areaDom = '';
    let province = $(e.target).parent().parent().parent().find('.open').html();
    let text = $(e.target).html();
    for (var i = 0; i < area[province][text].length; i++) {
      areaDom += '<li class = "ui-list-item ui-touchable js-target-info js-target" >' + area[province][text][i] + '</li>';
    }
    $(e.target).toggleClass('open')
      .next().append(areaDom)
      .toggleClass('hidden')
      .prev()
      .get(0).scrollIntoView();
  })
  .on('click', '.js-target-info', (e = event) => {
    const $target = $(e.target);
    const text = $target.text();
    const $city = $target.parent().parent();
    const city = $city.find('> .js-action').text();
    const $province = $city.parent().parent();
    const province = $province.find('> .js-action').text();
    let pcd = areaFormat(province, city, text);
    addressPcd = pcd;
    addressinfo.province = province;
    addressinfo.city = city;
    addressinfo.district = text;
    $('.addressPcd').html(addressPcd);
    hideChooser();
  });

$('.js-save-address').click(function () {
  addressinfo.name = $('#whoEl').val();
  addressinfo.phoneNumber = $('#telEl').val();
  addressPcd = $('.addressPcd').html();
  addressinfo.address = $('#addressEl').val();
  for (let key in addressinfo) {
    if (addressinfo[key] == '') {
      tipInfo('请填写完整信息');
      return false;
    }
  }
  let phone = addressinfo.phoneNumber;
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    tipInfo('手机号码填写有误');
    return false;
  }
  loadingInfo(true);
  //更新地址
  let url = '';
  let type = '';
  let datainfo = {};
  let msg = '';
  if (id) {
    url = '/api/trade/update-address';
    type = 'PUT';
    datainfo = {
      address: addressinfo.address,
      city: addressinfo.city,
      district: addressinfo.district,
      isDefault: isDefault,
      name: addressinfo.name,
      phoneNumber: addressinfo.phoneNumber,
      province: addressinfo.province,
      id: id,
    };
    msg = '地址更新成功!';
  } else {
    url = '/api/trade/create-address';
    type = 'POST';
    datainfo = {
      address: addressinfo.address,
      city: addressinfo.city,
      district: addressinfo.district,
      isDefault: isDefault,
      name: addressinfo.name,
      phoneNumber: addressinfo.phoneNumber,
      province: addressinfo.province,
    };
    msg = '地址添加成功!';
  }
  request(url, datainfo, type)
    .then(res => {
      if (res.success) {
        loadingInfo(false);
        id = res.data.id;
        tipInfo(msg);
        // let orderPage = sessionStorage.getItem('orderPage');
        if (orderPage === 'true') {
          // sessionStorage.setItem('orderPage', false);
          location.href = '/gp/order?p=' + productSpecification + '&&buyRoute=' + buyRoute + '&&addressId=' + id + '&&' + couponInfo;
        } else {
          location.href = '/gp/addresslist?p=' + productSpecification + '&&buyRoute=' + buyRoute + '&&' + couponInfo;
        }
      }
    })
    .catch(() => {
      loadingInfo(false);
      tipInfo('网络错误，请稍后重试！');
    });
});


$('.address_select').click(function (e = event) {
  $('#areaChooser').fadeIn();
  $('#app').addClass('noscroll');
  e.preventDefault();
  e.stopPropagation();
});

$('.js-close-chooser').click(function () {
  $('#app').removeClass('noscroll');
  $('#areaChooser').fadeOut();
});

function hideChooser() {
  $('#app').removeClass('noscroll');
  $('#areaChooser').fadeOut();
}




