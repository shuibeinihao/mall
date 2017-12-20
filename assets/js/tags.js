import $ from 'jquery';

$(document).ready(function(){
  $('.home-products-box').click(function(){
    const link = $(this).attr('data-link');
    const tagId = $(this).attr('data-tagId');
    const productId = $(this).attr('data-productId');
    if(link){
      xksTrack.track('MobileMall:Tag_Products:Product:Click',{'productLink': link ,'tagId': tagId});
    }else{
      xksTrack.track('MobileMall:Tag_Products:Product:Click',{'productId': productId ,'tagId': tagId});
    }
  });
});
