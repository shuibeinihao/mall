import $ from 'jquery';
import animate from './helper/_animate';
import request from './request';
import {CLICK_NAME} from './helper/_tap';

const TYPE_QUICK = 1;
const TYPE_PASSWORD = 2;

let data = {
  type: TYPE_QUICK,
  title: ['快捷登录', '密码登录'],
  area: {
    code: '+86',
    name: '中国'
  }
};

function render(newData) {
  if (newData.title !== data.title) {
    $('.js-name').text(newData.title[0]);
    $('.js-toggle').text(newData.title[1]);
  }

  if (newData.area !== data.area) {
    $('.js-area').html(`${newData.area.name}&nbsp;(${newData.area.code})`);
  }

  if (newData.type !== data.type) {
    if (newData.type === TYPE_QUICK) {
      $('.js-sign-wrapper').html(
        '<button class="login-codegen ui-touchable js-sign-code">获取验证码</button>');
      $('.js-tip').html('未注册心开始账户的手机号，登录时将自动注册。');
      $('.js-password').attr('placeholder', '请输入验证码');
    } else {
      $('.js-sign-wrapper').html('');
      $('.js-tip').html('如果忘记密码，请选择快捷登录进行登录，然后找回或修改码。');
      $('.js-password').attr('placeholder', '请输入密码');
    }
  }

  data = newData;
}

function hidePane(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  animate($pane, 'bounceOutDown', 'hidden');
}

function showDialog(msg) {
  const $dialog = $('.js-dialog');
  $dialog.find('.js-dialog-msg').text(msg);
  $dialog.removeClass('hidden');
}

function hideDialog() {
  const $dialog = $('.js-dialog');
  $dialog.addClass('hidden');
}

const $pane = $('.js-area-pane');
const $loginId = $('.js-loginId');
const $password = $('.js-password');
const $loginBtn = $('.js-login-btn');
const $signBtn = $('.js-sign-code');
const headers = {
  'CSRF-Token': $('.js-csrf').val()
};
let inCountDownInterval = false;
$(document)
  .on('keydown', evt => {
    if (evt.keyCode === 27) { //退出键
      hideDialog();
    }
  })
  .on(CLICK_NAME, '.js-area', () => {
    $pane.removeClass('hidden');
    animate($pane, 'bounceInUp');
  })
  .on(CLICK_NAME, '.js-back', hidePane)
  .on(CLICK_NAME, '.js-locale', evt => {
    const $target = $(evt.currentTarget);
    const code = $target.data('locale-code');
    const name = $target.data('locale-name');
    render(Object.assign({}, data, {area: {code, name}}));
    hidePane(evt);
  })
  .on(CLICK_NAME, '.js-toggle', () => {
    render(Object.assign({}, data, {
      type: data.type === TYPE_QUICK ? TYPE_PASSWORD : TYPE_QUICK,
      title: [].concat(data.title.reverse())
    }));
    if(data.type === TYPE_QUICK){
      xksTrack.track('MobileMall:Login/SignUp:Change_Mode:Click', {'loginType': 'password'});
    }else{
      xksTrack.track('MobileMall:Login/SignUp:Change_Mode:Click', {'loginType': 'sms'});
    }
  })
  .on(CLICK_NAME, '.js-dialog-ok', hideDialog)
  .on('input blur keyup', '.js-input', () => {
    const loginIdIsValid = !!$loginId.val().trim();
    $loginBtn.prop('disabled',
      !(loginIdIsValid && $password.val().trim()));
    if (!inCountDownInterval) {
      $signBtn.prop('disabled', !loginIdIsValid);
    }
  })
  .on(CLICK_NAME, '.js-sign-code', evt => {
    evt.preventDefault();
    evt.stopPropagation();

    request('/user/sendphonevalidation', {
      phone: $loginId.val().trim(),
      area: data.area.code
    }, 'POST', true, headers)
      .then(
        countDown,
        err => {
          if (err.phone) {
            showDialog('手机号码不正确');
            return;
          }
          showDialog(`发送短信出错：${err.message}`);
        }
      );
  })
  .on('submit', '.js-form', evt => {
    evt.preventDefault();
    $loginBtn
      .prop('disabled', true)
      .html('登录中&#8230;');

    let target = evt.target;
    request(target.action, {
      type: data.type,
      loginId: $loginId.val().trim(),
      password: $password.val().trim(),
      area: data.area.code
    }, 'POST', true, headers)
      .then(res => {
        if(data.type === TYPE_QUICK){
          xksTrack.track('MobileMall:Login/SignUp:Submit', {'state':'success','loginType': 'sms'});
        }else{
          xksTrack.track('MobileMall:Login/SignUp:Submit', {'state':'success','loginType': 'password'});
        }
        if(mixpanel){
          $loginBtn
            .html('登录成功');
          var userCreatedDate = new Date(res.userCreatedDate);
          mixpanel.identify(res.userId);
          mixpanel.people.set({
            'u-username': res.userInfo.nickName,
            '$name': res.userInfo.nickName,
            '$created': userCreatedDate.toISOString()
          });
          if(res.userPrivateInfo.phone){
            mixpanel.people.set({
              'u-phone': res.userPrivateInfo.phone,
              '$phone': res.userPrivateInfo.phone
            });
          }
        }
        setTimeout(function(){
          location.href = res.redirect || '/';
        }, 1000);
      })
      .catch(err => {
        if(data.type === TYPE_QUICK){
          xksTrack.track('MobileMall:Login/SignUp:Submit', {'state':'fail','loginType': 'sms'});
        }else{
          xksTrack.track('MobileMall:Login/SignUp:Submit', {'state':'fail','loginType': 'password'});
        }
        $loginBtn.prop('disabled', false).html('登录');
        if (err.message) {
          showDialog(err.message);
        } else if (err.loginId) {
          showDialog('手机号码不正确！');
        } else if (err.password) {
          showDialog('密码不正确！');
        } else {
          showDialog('请求出错！');
        }
      });
  });

function countDown() {
  let timer;
  let count = 120;
  const tick = () => {
    count--;
    $signBtn.text(`${count}秒后重新获取`);
    if (count < 0) {
      inCountDownInterval = false;
      clearInterval(timer);
      $signBtn.text('重新获取');
      if ($loginId.val().trim()) {
        $signBtn.prop('disabled', false);
      }
    }
  };

  $signBtn.prop('disabled', true);
  $signBtn.text(`${count}秒后重新获取`);
  inCountDownInterval = true;
  timer = setInterval(tick, 1000);
}

if(mixpanel) {
  mixpanel.track('MobileMall: Login/SignUp: View');
}
