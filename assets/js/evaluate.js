import $ from 'jquery';
import {CLICK_NAME} from './helper/_tap';
import {alert} from './helper/_alert';
import {loadingInfo} from './helper/_loading';
const CONTAINER_NAME = '.js-item';

const images = [];
const MAX = 3;

//弹出框提示获得心币，2秒后消失
function showXinBiNotification(scoreEarned) {
  $('#xinbi-notification .amount').text(scoreEarned);
  $('#xinbi-notification').fadeIn();
  setTimeout(function(){
    $('#xinbi-notification').fadeOut();
  }, 2000);
}

function load() {
  $('.js-images').on(CLICK_NAME, '.js-remove', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const $target = $(evt.currentTarget);
    const index = $target.data('index');
    $target.parent().remove();
    images.splice(index, 1);
    const $add = $('.js-add');
    if ($add.is(':hidden') && images.length < MAX) {
      $add.show();
    }
  });

  const readImage = (file) => {
    return $.Deferred(function(p) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        p.resolve(evt.target.result);
      };

      reader.onerror = p.reject;
      reader.readAsDataURL(file);
    }).promise();
  };

  const appendImage = (dataUri, file) => {
    const html = $('#template').html();
    const $img = $(html)
      .find('.js-remove').data('index', images.length).end()
      .find('img').attr('src', dataUri).end();

    const $add = $('.js-add');
    $add.before($img);
    images.push(file);
    if (images.length >= MAX) {
      $add.hide();
    }
  };

  $('.js-file').change((evt) => {
    const files = evt.target.files;
    const len = files.length;
    if (len) {
      Array.prototype.slice
        .call(files, 0, Math.min(len, MAX - images.length))
        .forEach(function (file) {
          readImage(file)
            .then(function(dataUri) {
              appendImage(dataUri, file);
            });
        });
    }
  });
}
$(document).ready(load);

$(document)
  .on(CLICK_NAME, '.js-star', evt => {
    const elm = evt.target;
    const starLevel = $(elm).attr('data-star-level');
    const elmContainer = $(elm).closest(CONTAINER_NAME);
    $(elmContainer).find('[name="starLevel"]').val(starLevel);
    $(elmContainer).find('[data-star-level]').each((i, item) => {
      if ($(item).attr('data-star-level') <= starLevel) {
        $(item).addClass('icon-font-star-active');
        $(item).removeClass('icon-font-star');
      } else {
        $(item).addClass('icon-font-star');
        $(item).removeClass('icon-font-star-active');
      }
    });
  })
  .on(CLICK_NAME, '.js-submit', () => {
    const data = new FormData();
    let validate = true;

    $(CONTAINER_NAME).each((i, item) => { //todo : what if multi items?
      const starLevel = $(item).find('[name="starLevel"]').val();
      if (starLevel < 1 || starLevel > 5) {
        alert({msg: '请对商品进行评分', onebutton: true});
        validate = false;
        return;
      }
      const productId = $(item).find('[name="productId"]').val();
      const subOrderId = $(item).find('[name="subOrderId"]').val();
      const content = $(item).find('[name="content"]').val().trim();

      data.append('productId', productId);
      data.append('subOrderId', subOrderId);
      data.append('starLevel', starLevel);
      data.append('content', content);
      if (images.length) {
        images.forEach(function (item) {
          data.append('file', item);
        });
      }
    });

    if (validate === true) {
      let productId = $('.js-submit').attr('data-productId');
      loadingInfo(true);
      $.ajax({
        url: '/api/zuul/trade/comment/save-file-comment',
        method: 'POST',
        processData: false,
        contentType: false,
        data: data,
        success: function (res) {
          if (res && res.success) {
            loadingInfo(false);
            if(res.data.scoreEarned) {
              showXinBiNotification(res.data.scoreEarned);
            }
            mixpanel.track('MobileMall: Evaluate: Submit', {'state': '@"success"}'});
            xksTrack.track('MobileMall:Evaluate:Submit', {'productId': productId ,'state':'success'});
            alert({msg: '评论成功', onebutton: true}, () => {
              window.location = '/gp/me?state=1';
            });
          } else {
            loadingInfo(false);
            mixpanel.track('MobileMall: Evaluate: Submit', {'state': '@"fail"}'});
            xksTrack.track('MobileMall:Evaluate:Submit', {'productId': productId ,'state':'fail'});
            alert({msg: res.retMsg, onebutton: true});
          }
        },
        error: (xhr, err) => {
          mixpanel.track('MobileMall: Evaluate: Submit', {'state': '@"fail"}'});
          xksTrack.track('MobileMall:Evaluate:Submit', {'productId': productId ,'state':'fail'});
          let msg = '评论失败，请稍后再试。';
          loadingInfo(false);
          if (err === 'timeout') {
            msg = '网络超时';
          }
          if (xhr.status === 413) {
            msg = '上传图片过大';
          }
          alert({msg, onebutton: true});
        }
      });
    }
  });

