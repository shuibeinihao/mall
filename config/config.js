'use strict';

const merge = require('lodash.merge');

const defaults = {
  api: {
    baseUrl: 'https://api-stage.mykaishi.com',
  },
  cdnBaseUrl: '',
  mallUrl: '//mall-stage.mykaishi.com/',
  mallAndInsuranceUrl: '//mall-stage.mykaishi.com/adv/insurance',
  gzipEnabled: true,
  debug: false,
  mixpanel: {
    token: '0f6ddbcf2da864c49bde1f8636151369'
  },
  needle: {
    openTimeout: 10000,
    readTimeout: 10000
  },
  port: process.env.PORT || 3000,
  rollbar: {
    accessToken: '96220d116b8f4827b1d67c287d934d88'
  },
  appStoreUrl: {
    en: {
      ios: {
        itunes: 'https://itunes.apple.com/us/app/xinkaishi/id1056313641',
        qq: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.mykaishi.xinkaishi'
      },
      android: {
        apk: 'http://oss.mykaishi.com/application/kaishi.apk',
        baidu: 'http://shouji.baidu.com/software/item?docid=8653495',
        qq: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.mykaishi.xinkaishi',
        xiaomi: 'http://app.mi.com/detail/151274'
      }
    },
    zh: {
      ios: {
        itunes: 'https://itunes.apple.com/cn/app/xinkaishi/id1056313641',
        qq: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.mykaishi.xinkaishi'
      },
      android: {
        apk: 'http://oss.mykaishi.com/application/kaishi.apk',
        baidu: 'http://shouji.baidu.com/software/item?docid=8653495',
        qq: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.mykaishi.xinkaishi',
        xiaomi: 'http://app.mi.com/detail/151274'
      }
    }
  },
};

const config = {
  development: {
    debug: true,
    mode: 'development',
    cdnBaseUrl: '',
    gzipEnabled: false,
  },
  stage: {
    api: {
      baseUrl: 'https://api-stage.mykaishi.com',
    },
    cdnBaseUrl: 'http://oss-stage.mykaishi.com/mall',
    debug: true,
    mode: 'stage',
  },
  production: {
    api: {
      baseUrl: 'https://api.mykaishi.com',
    },
    cdnBaseUrl: 'http://oss.mykaishi.com/mall',
    mallUrl: '//mall.mykaishi.com/',
    mallAndInsuranceUrl: '//mall.mykaishi.com/adv/insurance',
    mode: 'production',
  }
};

module.exports = (mode) => {
  const loadedConfig = config[mode || process.env.NODE_ENV] || config.development;
  return merge(defaults, loadedConfig);
};
