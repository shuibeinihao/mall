const ERROR_MSG = {
  NotFound: '账号不存在',
  InvalidPassword: '密码不正确',
  NoGuest: '未登录',
  InvalidInput: '验证码不正确'
};

module.exports = function (error) {
  const errorCode = error.errorCode;
  let errStr;
  if (errorCode) {
    errStr = ERROR_MSG[errorCode] || errorCode;
  } else { //比如网络错误
    errStr = error.message;
  }

  return errStr;
};
