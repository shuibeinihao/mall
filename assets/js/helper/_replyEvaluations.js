import $ from 'jquery';
import {tipInfo} from './_tipInfo';
import {loadingInfo} from './_loading';
import request from '../request';

export function replyEvaluations() {
  let commentId = '';
  $('.commentReply').click(function () {
    commentId = $(this).attr('data-commentId');
    $('.commentPopWrap').show();
  });
  $('.commentPopBg,.commentCancelBtn').click(function () {
    $('.commentPopWrap').hide();
  });
  $('.commentOkBtn').click(function () {
    let replyText = $('.replyText').val();
    if (replyText) {
      $('.commentPopWrap').hide();
      let url = `/api/trade/comment/${commentId}/reply`;
      let data = {
        'content': replyText
      };
      loadingInfo(true);
      request(url, data, 'POST')
        .then(() => {
          loadingInfo(false);
          $('.replyText').val('');
          tipInfo('回复成功！');
          location.reload(true);
        })
        .catch(() => {
          loadingInfo(false);
          $('.replyText').val('');
          tipInfo('网络错误，请稍后重试！');
        });
    } else {
      tipInfo('请输入要回复的内容');
    }

  });
}

