let nunjucks = require('nunjucks');
let sizeOf = require('image-size');
let assetsFilter = require('./assetsFilter');
const moment = require('moment');
// const config = require('../config/config')();

moment.locale('zh-cn');

module.exports = function (options, filters) {
  const env = nunjucks.configure('views', {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    dev: options.isDev,
    watch: options.isDev,
    noCache: options.isDev,
    express: options.express
  });
  env.addFilter('asset', assetsFilter);
  env.addFilter('date', time => {
    const d = new Date(time);
    const pad = (v) => v < 10 ? '0' + v : v;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} `
      + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  });
  env.addFilter('price', price => Number(price).toFixed(2));
  env.addFilter('seplength', (str = '', sep = ',') => str.split(sep).length);
  env.addFilter('phonemask', phone => phone.substr(0, 3) + '****' + phone.substr(-4));
  env.addFilter('json', str => JSON.stringify(str));
  env.addFilter('pad', n => n < 10 ? '0' + n : n);
  env.addFilter('trunc', (str = '', len) => str.length > len ? str.substr(0, len) + '...' : str);
  env.addFilter('hwRatio', file => {
    const dimensions = sizeOf(file);
    return `${(dimensions.height / dimensions.width) * 100}%`;
  });

  //布尔值
  env.addFilter('bool', (value) => !!value);

  //相对时间
  // env.addFilter('fromNow', (unixTimestamp) => moment(unixTimestamp).format('L'));

  //计算当前时间与给定时间之间的秒数 分钟数 小时数 评价时间显示
  env.addFilter('diffHandle', (_autoD) => {
    let currTimesD = Date.parse(new Date());
    let showText = '';
    //时间戳之差
    let utcDiffer = currTimesD - _autoD;
    //发货时间与当前时间相差多少秒
    let secondDiffer = parseInt(utcDiffer / 1000);
    let second = secondDiffer;
    if (second > 0 && second <= 60) {
      showText = '刚刚';
    } else if (second > 60 && second <= 3600) {
      showText = parseInt(second / 60) + '分钟前';
    } else if (second > 3600 && second <= 86400) {
      showText = parseInt(second / 3600) + '小时前';
    }else if (second > 86400 && second <= 604800) {
      showText = parseInt(second / (3600 * 24)) + '天前';
    }
    else if (second > 604800) {
      const date = new Date(_autoD);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      showText = [year + '-' + ('0' + month).substr(-2) + '-' + ('0' + day).substr(-2)].join('-');
    }
    return showText;
  });

  //计算距离自动取消时间
  env.addFilter('timeDifference', (_autoD, _DAY) => {
    //当前时间戳
    let _currTimesD = Date.parse(new Date());
    let utcDiffer = _currTimesD - _autoD;
    //发货时间与当前时间相差多少秒
    let secondDiffer = parseInt(utcDiffer / 1000);
    let targetHours = _DAY * 24 * 60 * 60;
    //还剩多少秒
    let differInfo = targetHours - secondDiffer;
    let second = differInfo, minute = 0, hour = 0, day = 0;
    minute = parseInt(second / 60);
    second %= 60;
    //如果分钟大于60，计算出小时和分钟
    if (minute > 60) {
      hour = parseInt(minute / 60);
      minute %= 60;
    }
    if (hour > 24) {
      day = parseInt(hour / 24);
      hour %= 24;
    }
    return day + '天' + hour + '小时' + minute + '分';
  });

  //用户等级显示
  env.addFilter('userScoreGrade', (numGrade) => {
    switch (numGrade) {
      case 1:
        return '菜鸟心';
      case 2:
        return '入门心';
      case 3:
        return '见习心';
      case 4:
        return '好孕萌';
      case 5:
        return '红粉萌';
      case 6:
        return '非凡靓';
      case 7:
        return '伟大靓';
      case 8:
        return '超人靓';
      case 9:
        return '卓越美';
      case 10:
        return '美丽妈';
      default:
        return '菜鸟心';
    }
  });

  //用户性别显示
  env.addFilter('userRole', (strUserRole) => {
    switch (strUserRole) {
      case 'Mom':
        return '妈';
      case 'Dad':
        return '妈'; //3.3开始没有宝爸
      default:
        return '妈';
    }
  });

  env.addFilter('saleType', (type) => {
    switch (type) {
      case 'RETURN':
        return '退货';
      case 'BARTER':
        return '换货';
    }
  });

  //banner根据type跳转链接
  env.addFilter('homeBannerUrl', (type, objId, url) => {
    let baseUrl = process.env.WEBSITE_URL;
    switch (type) {
      case 'CommunityThread'://帖子
        return `${baseUrl}/thread/${objId}`;
      case 'Product'://商品
        return `/product/${objId}`;
      case 'EatOrNot'://能不能吃
        return `${baseUrl}/ingredients`;
      case 'Topic'://话题
        return `${baseUrl}/topics/${objId}`;
      case 'NoneLink'://无连接
        return 'javascript:;';
      case 'Community'://圈子
        return `${baseUrl}/community`;
      case 'URL'://外部链接
        return `${url}`;
      case 'Mall'://商城
        return '/';
    }
  });

  //OSS 图片缩放
  //doc: https://help.aliyun.com/document_detail/44688.html
  //ex: parameters = {w:500,limit:0}
  env.addFilter('ossImageResize', (url, parameters) => {
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
  });

  //asset地址
  // const assetUrl = (assetPath) => config.cdnBaseUrl + assetPath;
  // env.addFilter('assetUrl', assetUrl);

  env.addFilter('useVanillaLazyload', (text) => text ? text.replace(/src="/g, 'data-original="') : '');

  if (filters) {
    Object.keys(filters).forEach(key => env.addFilter(key, filters[key]));
  }

  env.addGlobal('mixpanel', {token: process.env.MIXPANEL_TOKEN});
  env.addGlobal('xksTrack', {token: process.env.XKS_TRACK_TOKEN, apiUrl: process.env.XKS_TRACK_API, libUrl: process.env.XKS_TRACK_LIB_URL});
  env.addGlobal('rollbar', {accessToken: process.env.ROLLBAR_ACCESS_TOKEN, environment: process.env.NODE_ENV,
    ignoredMessages: [
      '_Box_',
      'Can\'t find variable: performance',
      'MeiYouJSBridge',
      'WeixinJSBridge',
      'GetImageTagSrcFromPoint',
      'androidGetInfo is not defined',
      'doPreloadClicked_BD']
  });

  return env;
};
