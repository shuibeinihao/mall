import $ from 'jquery';
import Swiper from 'swiper';
import './helper/_tap';
import LazyLoad from 'lazyload';
import {tipInfo} from './helper/_tipInfo';

const options = {
  pagination: '.swiper-pagination',
  loop: true,
  autoplay: 5000,
  lazyLoading: true,
  autoplayDisableOnInteraction: false
};
new Swiper('.swiper-container', options);

let num = 4;//每次加载的个数
let offset = +$('.productMore').attr('data-productLength')-num;//从第几条数据开始
let maxNum = 20; //设置加载最多次数
let flag = true; //接口请求完成之后才能继续请求接口
let productTip = $('.productTip');//加载中... 数据加载完毕

//图片裁剪
const ossImageResize = (url, parameters)=> {
  let returnUrl = url;
  if (url.indexOf('?') < 0) {
    returnUrl = `${url}?x-oss-process=image/resize`;
  } else {
    returnUrl = `${url}&x-oss-process=image/resize`;
  }
  Object.keys(parameters).forEach(key => {
    returnUrl = `${returnUrl},${key}_${parameters[key]}`;
  });
  return returnUrl;
};
//页面结构渲染
const renderDom = (_data)=>{
  let _html = '';
  let list = _data;
  let b = [];
  let result = [];
  let k = 0;

  for(var i = 0; i<list.length; ++i){
    if(i%2 == 0){
      b = [];
      for(var j = 0; j<2; ++j){
        if(list[i+j] == undefined){
          continue;
        } else{
          b[j] = list[i+j];
        }
      }
      result[k] = b;
      k++;
    }
  }
  for(j=0;j<result.length;j++){
    _html+='<div class="row">';
    for(i=0;i<result[j].length;i++){
      if(result[j][i].product.type === 3){//广告商品
        _html+='<div class="col-8 tags-list">';
        _html+=`<a href="${result[j][i].product.link}" onclick="mixpanel.track('MobileMall: Tag Products : Click',{'type':'${result[j][i].product.name}'});" class="home-products-box d-block">`;
        _html+=`<img src="${ossImageResize(result[j][i].product.imgList[0],{w:320,h:320,m:'fill'})}" alt="${result[j][i].product.name}"/>`;
        _html+=`<div class="productlist_name overflowEllipsis">${result[j][i].product.name}</div>`;
        _html+=`<div class="productlist_price">${result[j][i].snapshot.priceDesc}</div>`;
        _html+='</a>';
        _html+='</div>';
      }else{
        _html+='<div class="col-8 tags-list">';
        _html+=`<a href="/product/${result[j][i].product.id}" onclick="mixpanel.track('MobileMall: Tag Products : Click',{'type':'${result[j][i].product.name}'});" class="home-products-box d-block">`;
        _html+=`<img src="${ossImageResize(result[j][i].product.imgList[0],{w:320,h:320,m:'fill'})}" alt="${result[j][i].product.name}"/>`;
        _html+=`<div class="productlist_name overflowEllipsis">${result[j][i].product.name}</div>`;
        _html+='<div class="productlist_price">';
        if(result[j][i].snapshot.scorePrice > 0){
          _html+=`<span class="text-orange price-xinbi"><span class="icon"></span><span class="js-price-xinbi">${result[j][i].snapshot.scorePrice}</span></span>`;
        }
        if(result[j][i].snapshot.price > 0 ){
          _html+=`<span class="text-primary price-current-primary">&yen; <span class="js-spec-price bigger">${result[j][i].snapshot.price}</span></span>`;
        }
        _html+='</div>';
        _html+='<del class="productlist_price_del">';
        _html+=`&yen; ${result[j][i].snapshot.originalPrice} `;
        _html+='</del>';
        _html+='</a>';
        _html+='</div>';
      }
    }
    _html+='</div>';
  }
  return _html;
};
//数据获取
const productList = () => {
  flag = false;
  let url = `/api/trade/mall/home/hot-product?offset=${offset}&size=${num}`;
  productTip.show();
  $.ajax({
    type: 'GET',
    url,
    contentType: 'application/json',
    dataType: 'json',
    success: function(res){
      if (res.length <= 0) {
        productTip.html('没有更多数据');
        return false;
      }
      productTip.hide();
      flag = true;
      let _htmlInfo = renderDom(res);
      $('.productMore').append(_htmlInfo);
      //点击图片放大 图片懒加载
      new LazyLoad();
    },
    error: () => {
      tipInfo('网络错误，请稍后重试！');
    }
  });
};
//滑动到底加载数据
$(document).ready(function () {
  let totalHeight = 0;
  $(window).scroll(function () {
    let scrollPos = $(window).scrollTop();
    totalHeight = parseFloat($(window).height()) + parseFloat(scrollPos);
    if (($(document).height()) <= totalHeight && num != maxNum) {
      if (flag === true) {
        offset = offset + num;
        productList();
      }
    }
  });
});

//事件采集
$('.home-swiper-img').click(function(){
  let type = $(this).attr('data-type');
  let objId = $(this).attr('data-objId');
  xksTrack.track('MobileMall:Homepage:TopBanners:Click', {'bannerType': type,'bannerId': objId});
});

$('.home-products-box').click(function(){
  const link = $(this).attr('data-link');
  const productId = $(this).attr('data-productId');
  if(link){
    xksTrack.track('MobileMall:Homepage:Product:Click',{'productLink': link });
  }else{
    xksTrack.track('MobileMall:Homepage:Product:Click',{'productId': productId });
  }
});


